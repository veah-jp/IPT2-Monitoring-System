import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';

function useChart(canvasRef, config) {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !window.Chart || !config) return;
    
    if (chartRef.current) {
      // Update existing chart data smoothly
      chartRef.current.data = config.data;
      chartRef.current.options = config.options;
      chartRef.current.update('active');
    } else {
      // Create new chart
      chartRef.current = new window.Chart(canvasRef.current.getContext('2d'), config);
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [canvasRef, config]);
}

async function fetchJson(url) {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

const DashboardApp = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState({ students: 0, faculty: 0 });
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState('');

  // Hide Bootstrap caret on dropdowns (global)
  useEffect(() => {
    const styleId = 'global-hide-dropdown-caret';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `.dropdown-toggle::after{display:none !important;}`;
      document.head.appendChild(style);
    }
  }, []);
  const [coursesData, setCoursesData] = useState([]);
  const [facultyByDept, setFacultyByDept] = useState([]);

  const combinedCanvas = useRef(null);

  // Load departments + totals (initial and polling)
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const departmentsData = await fetchJson('/api/departments-data');
        const depList = departmentsData?.departments || departmentsData?.data || [];
        let facultyDist = departmentsData?.facultyDistribution || departmentsData?.faculty_by_department || [];
        let totalStudents = departmentsData?.totalStudents ?? departmentsData?.totals?.students;
        let totalFaculty = departmentsData?.totalFaculty ?? departmentsData?.totals?.faculty;

        // Derive when API doesn't provide explicit totals/distribution
        if (depList && depList.length) {
          if (typeof totalStudents !== 'number') {
            totalStudents = depList.reduce((sum, d) => sum + Number(d.totalStudents ?? d.students ?? 0), 0);
          }
          if (typeof totalFaculty !== 'number') {
            totalFaculty = depList.reduce((sum, d) => sum + Number(d.totalFaculty ?? d.faculty ?? 0), 0);
          }
          if (!facultyDist || facultyDist.length === 0) {
            facultyDist = depList.map(d => ({
              name: d.name || d.department_name || 'Department',
              count: Number(d.totalFaculty ?? d.faculty ?? 0)
            }));
          }
        }
        if (!isMounted) return;
        setDepartments(depList);
        setFacultyByDept(facultyDist);
        setTotals({ students: Number(totalStudents) || 0, faculty: Number(totalFaculty) || 0 });
        // Do not auto-select a department; default view shows all departments
      } catch (err) {
        if (isMounted) setError('Failed to load dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { isMounted = false; clearInterval(id); };
  }, [departmentId]);

  // Load courses for selected department (initial and polling)
  useEffect(() => {
    let isMounted = true;
    async function loadCourses() {
      if (!departmentId) {
        setCoursesData([]);
        return;
      }
      try {
        const url = `/api/courses-by-department?department_id=${encodeURIComponent(departmentId)}`;
        console.log('Loading courses for department:', departmentId, 'URL:', url);
        const data = await fetchJson(url);
        const list = data?.courses || data?.data || [];
        console.log('Courses data received:', list);
        if (isMounted) setCoursesData(list);
      } catch (err) {
        console.error('Error loading courses:', err);
        if (isMounted) setCoursesData([]);
      }
    }
    loadCourses();
    const id = setInterval(loadCourses, 30000);
    return () => { isMounted = false; clearInterval(id); };
  }, [departmentId]);

  const combinedConfig = useMemo(() => {
    // When no department selected: show totals per department (both students and faculty)
    if (!departmentId) {
      if (!departments || departments.length === 0) return null;
      const labels = departments.map((d) => d.name || d.department_name || 'Department');
      const studentValues = departments.map((d) => Number(d.totalStudents ?? d.students ?? 0));
      const facultyValues = departments.map((d) => Number(d.totalFaculty ?? d.faculty ?? 0));
      return {
        type: 'bar',
        data: { 
          labels, 
          datasets: [
            { label: 'Students', data: studentValues, backgroundColor: '#8A63D2' },
            { label: 'Faculty', data: facultyValues, backgroundColor: '#FFC107' }
          ] 
        },
        options: { 
          responsive: true, 
          plugins: { 
            legend: { display: true, position: 'top' },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: '#8A63D2',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                title: function(context) {
                  return context[0].label;
                },
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}: ${value}`;
                }
              }
            }
          }, 
          scales: { y: { beginAtZero: true } },
          animation: {
            duration: 1200,
            easing: 'easeInOutQuart'
          },
          hover: {
            animationDuration: 400
          }
        }
      };
    }
    
    // When specific department selected: show only students by course
    if (!coursesData || coursesData.length === 0) return null;
    const labels = coursesData.map((c) => c.name || c.course_name || 'Course');
    const studentValues = coursesData.map((c) => Number(c.student_count ?? c.students ?? 0));
    
    return {
      type: 'bar',
      data: { 
        labels, 
        datasets: [
          { label: 'Students', data: studentValues, backgroundColor: '#8A63D2' }
        ] 
      },
      options: { 
        responsive: true, 
        plugins: { 
          legend: { display: true, position: 'top' },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#8A63D2',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}`;
              }
            }
          }
        }, 
        scales: { y: { beginAtZero: true } },
                 animation: {
           duration: 1200,
           easing: 'easeInOutQuart'
         },
         hover: {
           animationDuration: 400
         }
      }
    };
  }, [coursesData, departments, departmentId]);

  useChart(combinedCanvas, combinedConfig);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fb' }}>
      <Sidebar active="dashboard" width={280} />






      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <header style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderBottom: 'none'
        }}>
          <div className="d-flex align-items-center justify-content-between p-4">
            <div className="d-flex align-items-center">
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-chart-line text-white" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h2 className="m-0 text-white fw-bold" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>Dashboard</h2>
                <small className="text-white-50" style={{ fontSize: '14px' }}>Welcome back, Jerremae</small>
              </div>
            </div>
            
            <div className="dropdown">
              <button className="btn dropdown-toggle d-flex align-items-center gap-3" type="button" data-bs-toggle="dropdown" style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '12px 20px',
                color: 'white',
                backdropFilter: 'blur(10px)',
                                 transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>J</div>
                <span className="fw-medium">Jerremae</span>
              </button>
                             <ul className="dropdown-menu dropdown-menu-end" style={{
                 border: 'none',
                 borderRadius: '20px',
                 boxShadow: '0 30px 100px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
                 padding: '12px',
                 background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.9) 100%)',
                 backdropFilter: 'blur(30px) saturate(1.5) brightness(1.1)',
                 minWidth: '180px',
                 width: '180px',
                 marginTop: '12px',
                 position: 'relative',

                 overflow: 'hidden',
                 transform: 'translateY(0)'
               }}>
                 <li>
                   <a className="dropdown-item d-flex align-items-center py-3 px-3" href="/logout" style={{ 
                     borderRadius: '12px',

                     position: 'relative',
                     overflow: 'hidden'
                   }}>
                     <div>
                       <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Logout</div>
                       <small className="text-muted" style={{ fontSize: '12px' }}>Sign out safely</small>
                     </div>
                   </a>
                 </li>
               </ul>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {error ? <div className="alert alert-danger">{error}</div> : null}

          <div className="row g-4">
            <div className="col-12 col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <div className="h2 fw-bold text-primary">{totals.students}</div>
                  <div className="text-muted">Total Students</div>
                </div>
              </div>
              <div className="card shadow-sm mt-3">
                <div className="card-body text-center">
                  <div className="h2 fw-bold text-success">{totals.faculty}</div>
                  <div className="text-muted">Total Faculty</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-9">
              <div className="card shadow-sm">
                <div className="card-header d-flex align-items-center" style={{ background: '#8A63D2', color: '#fff' }}>
                  <i className="fas fa-chart-bar me-2"></i>
                  <strong>Students and Faculty Overview</strong>
            </div>
            <div className="card-body">
                  <div className="text-muted small mb-3">
                    {departmentId ? 'Students by course' : 'Students and faculty by department'}
                  </div>
                  <canvas ref={combinedCanvas} height="120"></canvas>
                </div>
              </div>
              
              {/* Department Selector below chart */}
              <div className="mt-3 d-flex justify-content-end">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">Select Department</span>
                  <select className="form-select" style={{ minWidth: 200 }} value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                      <option key={String(d.id ?? d.department_id)} value={String(d.id ?? d.department_id)}>
                        {d.name || d.department_name || 'Department'}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => {
                    const ev = new Event('manual-refresh');
                    window.dispatchEvent(ev);
                  }}>Refresh</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mountDashboard = () => {
  const container = document.getElementById('react-dashboard-container');
  if (container) {
    ReactDOM.render(<DashboardApp />, container);
  }
};

window.mountDashboard = mountDashboard;
