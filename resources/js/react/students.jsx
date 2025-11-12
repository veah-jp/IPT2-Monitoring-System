import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';
import AddStudentModal from './components/AddStudentModal.jsx';

// Removed useStudentsDomBridge - using original students.js instead
function unusedFunction() {
  useEffect(() => {
    const studentSearch = document.getElementById('studentSearch');
    const courseFilter = document.getElementById('courseFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const studentTable = document.querySelector('.table tbody');

    let searchTimeout;

    async function fetchJson(url) {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    }

    async function populateDepartmentFilter() {
      if (!departmentFilter) return;
      try {
        const data = await fetchJson('/api/departments');
        const active = (data || []).filter(d => d.is_active !== 0);
        departmentFilter.innerHTML = '<option value="">Filter by Department</option>';
        active.forEach(d => {
          const opt = document.createElement('option');
          opt.value = String(d.department_id);
          opt.textContent = d.department_name;
          departmentFilter.appendChild(opt);
        });
      } catch (_) {}
    }

    function handleSearch(term) {
      if (!studentTable) return;
      const rows = studentTable.querySelectorAll('tr');
      const needle = term.toLowerCase();
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(needle) ? '' : 'none';
      });
    }

    function hideCourseFilter() {
      const container = document.getElementById('courseFilterContainer');
      if (container) container.style.display = 'none';
      if (courseFilter) courseFilter.value = '';
    }

    function showCourseFilter() {
      const container = document.getElementById('courseFilterContainer');
      if (container) container.style.display = 'block';
    }

    function populateCourseFilter(courses) {
      if (!courseFilter) return;
      courseFilter.innerHTML = '<option value="">Filter by Course</option>';
      courses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.course_name;
        opt.textContent = c.course_name;
        courseFilter.appendChild(opt);
      });
    }

    async function loadCoursesByDepartment(deptVal) {
      try {
        const data = await fetchJson(`/api/courses-by-department?department_id=${encodeURIComponent(deptVal)}`);
        const list = data?.courses || [];
        if (list.length > 0) {
          populateCourseFilter(list);
          showCourseFilter();
        } else {
          hideCourseFilter();
        }
      } catch (_) {
        hideCourseFilter();
      }
    }

    function applyFilters() {
      if (!studentTable) return;
      const rows = studentTable.querySelectorAll('tr');
      const courseVal = courseFilter?.value || '';
      const deptVal = departmentFilter?.value || '';
      const searchVal = studentSearch?.value || '';

      rows.forEach(row => {
        let isVisible = true;

        if (courseVal) {
          const cell = row.querySelector('td:nth-child(4)');
          const badge = cell?.querySelector('.editable-text');
          const text = badge?.textContent?.toLowerCase() || '';
          isVisible = isVisible && text.includes(courseVal.toLowerCase());
        }

        if (deptVal && isVisible) {
          const cell = row.querySelector('td:nth-child(5)');
          const badge = cell?.querySelector('.editable-text');
          const deptText = badge?.textContent?.toLowerCase()?.trim() || '';
          const selected = departmentFilter.options[departmentFilter.selectedIndex];
          const label = selected ? selected.text.toLowerCase().trim() : '';
          isVisible = isVisible && (label ? deptText.includes(label) : true);
        }

        if (searchVal && isVisible) {
          const text = row.textContent.toLowerCase();
          isVisible = isVisible && text.includes(searchVal.toLowerCase());
        }

        row.style.display = isVisible ? '' : 'none';
      });
    }

    async function handleDepartmentChange(value) {
      if (!value) {
        hideCourseFilter();
        applyFilters();
        return;
      }
      await loadCoursesByDepartment(value);
      applyFilters();
    }

    // Wire events
    if (studentSearch) {
      studentSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
      });
    }
    if (courseFilter) {
      courseFilter.addEventListener('change', applyFilters);
    }
    if (departmentFilter) {
      departmentFilter.addEventListener('change', (e) => handleDepartmentChange(e.target.value));
    }

    // Init
    populateDepartmentFilter();

    return () => {
      if (studentSearch) studentSearch.oninput = null;
      if (courseFilter) courseFilter.onchange = null;
      if (departmentFilter) departmentFilter.onchange = null;
    };
  }, []);
}

function StudentsBridge() {
  // Let the original students.js handle all functionality
  // Just ensure the content is moved into place
  useEffect(() => {
    // Move the existing students content into the React layout
    const contentWrapper = document.getElementById('students-content-wrapper');
    const contentContainer = document.getElementById('students-content-container');
    
    if (contentWrapper && contentContainer) {
      // Move all children from wrapper to container
      while (contentWrapper.firstChild) {
        contentContainer.appendChild(contentWrapper.firstChild);
      }
      // Remove the now-empty wrapper
      contentWrapper.remove();
      
      // Re-initialize the original students.js after content is moved
      setTimeout(() => {
        if (window.StudentsPage) {
          // If StudentsPage class exists, reinitialize it
          new window.StudentsPage();
        } else {
          // Otherwise, trigger a custom event to reinitialize
          window.dispatchEvent(new CustomEvent('studentsContentMoved'));
        }
      }, 100);
    }
  }, []);
  
  return null;
}

function StudentsLayout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Prevent horizontal scroll on this page
  useEffect(() => {
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    const prevBodyTouchAction = document.body.style.touchAction;
    const prevHtmlTouchAction = document.documentElement.style.touchAction;
    const prevBodyOverscrollX = document.body.style.overscrollBehaviorX;
    const prevHtmlOverscrollX = document.documentElement.style.overscrollBehaviorX;
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    // Disable horizontal swipe/back gesture overlays
    document.body.style.touchAction = 'pan-y';
    document.documentElement.style.touchAction = 'pan-y';
    document.body.style.overscrollBehaviorX = 'none';
    document.documentElement.style.overscrollBehaviorX = 'none';
    return () => {
      document.body.style.overflowX = prevBodyOverflowX;
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.body.style.touchAction = prevBodyTouchAction;
      document.documentElement.style.touchAction = prevHtmlTouchAction;
      document.body.style.overscrollBehaviorX = prevBodyOverscrollX;
      document.documentElement.style.overscrollBehaviorX = prevHtmlOverscrollX;
    };
  }, []);

  // Handle add student button click
  useEffect(() => {
    const handleAddStudentClick = (e) => {
      if (e.target && e.target.id === 'addStudentsBtn') {
        e.preventDefault();
        e.stopPropagation();
        setIsAddModalOpen(true);
      }
    };

    // Add event listener to document to catch clicks on the add button
    document.addEventListener('click', handleAddStudentClick);

    return () => {
      document.removeEventListener('click', handleAddStudentClick);
    };
  }, []);

  // Tweak course pill/badge spacing in the table (reduce excessive padding)
  useEffect(() => {
    const styleId = 'students-course-pill-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Scope only to students page container */
        #students-content-container table tbody td:nth-child(4) .editable-text,
        #students-content-container table tbody td:nth-child(4) .badge {
          padding: 4px 8px !important;
          border-radius: 9999px !important;
          font-size: 12px !important;
          line-height: 1.1 !important;
        }
        /* Hide chevron SVG arrows in paginator on Students page */
        #students-content-container nav[role='navigation'] svg {
          display: none !important;
        }
        /* Hide bootstrap caret on dropdown toggle */
        .dropdown-toggle::after {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const handleStudentAdded = (newStudent) => {
    // Refresh the page to show the new student
    window.location.reload();
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fb', overflowX: 'hidden' }}>
      <Sidebar active="students" width={280} />
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
                <i className="fas fa-users text-white" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h2 className="m-0 text-white fw-bold" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>Students</h2>
                <small className="text-white-50" style={{ fontSize: '14px' }}>Manage student records and information</small>
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

        {/* Students Content */}
        <div className="p-4" style={{ maxWidth: 'min(1600px, calc(100vw - 48px))', width: '100%', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            padding: '24px',
            border: '1px solid rgba(0,0,0,0.05)',
            overflowX: 'hidden',
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div id="students-content-container" style={{ 
              height: '100%', 
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {/* Students content will be moved here */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
}

export function mountStudents() {
  const layoutContainer = document.getElementById('react-layout-root');
  if (!layoutContainer) {
    console.error('React layout container not found');
    return;
  }

  // Render the full layout with Header and Sidebar
  ReactDOM.render(<StudentsLayout />, layoutContainer);
  
  // Initialize the DOM bridge events after layout render
  const bridgeContainerId = 'react-students-bridge';
  let bridgeContainer = document.getElementById(bridgeContainerId);
  if (!bridgeContainer) {
    bridgeContainer = document.createElement('div');
    bridgeContainer.id = bridgeContainerId;
    document.body.appendChild(bridgeContainer);
  }
  ReactDOM.render(<StudentsBridge />, bridgeContainer);
}

if (typeof window !== 'undefined') {
  window.mountStudents = mountStudents;
}


