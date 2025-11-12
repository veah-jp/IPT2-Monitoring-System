import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './shared/Sidebar.jsx';

// Main Reports Component
const ReportsApp = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDepartmentChanging = useRef(false);

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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Apply filters when students data changes (after department change loads new data)
    // or when course selection changes
    // But skip if we're in the middle of a department change (it will be handled manually)
    if (!isDepartmentChanging.current && students.length > 0) {
      applyFilters();
    }
  }, [students, selectedCourse]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load departments and courses
      const [deptResponse, courseResponse] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/courses')
      ]);
      
      if (deptResponse.ok) {
        const depts = await deptResponse.json();
        setDepartments(depts.filter(d => d.is_active !== 0));
      }
      
      if (courseResponse.ok) {
        const crs = await courseResponse.json();
        setCourses(crs.filter(c => c.is_active !== 0));
      }
      
      // Load initial student data
      const loadedStudents = await loadStudentData();
      // Apply filters after initial load
      if (loadedStudents.length > 0) {
        applyFilters(loadedStudents, 'all');
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async (departmentId = null) => {
    try {
      const deptId = departmentId !== null ? departmentId : selectedDepartment;
      const response = await fetch('/api/reports/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ department: deptId })
      });
      
      if (response.ok) {
        const data = await response.json();
        const loadedStudents = data.details?.students || [];
        setStudents(loadedStudents);
        // Apply filters immediately after loading data
        return loadedStudents;
      }
      return [];
    } catch (error) {
      console.error('Error loading student data:', error);
      return [];
    }
  };

  const applyFilters = (studentsToFilter = null, courseId = null) => {
    // Use provided students list or current state
    const studentsList = studentsToFilter !== null ? studentsToFilter : students;
    // Use provided course ID or current state
    const courseToFilter = courseId !== null ? courseId : selectedCourse;
    
    // Start with all students from the list
    let filtered = [...studentsList];
    
    // Only filter by course - department filtering is handled by loadStudentData
    if (courseToFilter !== 'all' && courses.length > 0) {
      const course = courses.find(c => c.course_id == courseToFilter);
      if (course) {
        filtered = filtered.filter(s => s.course_name === course.course_name);
      }
    }
    
    setFilteredStudents(filtered);
  };

  const handleDepartmentChange = async (deptId) => {
    setLoading(true);
    // Set flag to prevent useEffect from interfering
    isDepartmentChanging.current = true;
    // Clear filtered students immediately to show loading state
    setFilteredStudents([]);
    // Reset course filter first
    setSelectedCourse('all');
    // Update department
    setSelectedDepartment(deptId);
    try {
      // Always reload data when department changes (whether 'all' or specific department)
      const loadedStudents = await loadStudentData(deptId);
      // Apply filters immediately with the loaded data
      // This ensures the UI updates correctly
      if (loadedStudents && loadedStudents.length > 0) {
        applyFilters(loadedStudents, 'all');
      } else {
        setFilteredStudents([]);
      }
    } catch (error) {
      console.error('Error changing department:', error);
      // Even on error, clear filtered students
      setFilteredStudents([]);
    } finally {
      setLoading(false);
      // Reset flag after a short delay to allow state to settle
      setTimeout(() => {
        isDepartmentChanging.current = false;
      }, 100);
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    // Filters will be applied by useEffect when selectedCourse changes
  };

  const courseSections = useMemo(() => {
    if (selectedCourse !== 'all' || selectedDepartment === 'all') {
      return [];
    }

    const courseMap = filteredStudents.reduce((acc, student) => {
      const courseName = student.course_name || 'Unassigned Course';
      if (!acc[courseName]) {
        acc[courseName] = [];
      }
      acc[courseName].push(student);
      return acc;
    }, {});

    return Object.entries(courseMap)
      .sort(([aName], [bName]) => aName.localeCompare(bName))
      .map(([courseName, studentsInCourse]) => ({
        courseName,
        students: studentsInCourse
      }));
  }, [filteredStudents, selectedCourse, selectedDepartment]);

  const departmentCourseSections = useMemo(() => {
    if (filteredStudents.length === 0) {
      return [];
    }

    const departmentMap = filteredStudents.reduce((deptAcc, student) => {
      const departmentName = student.department_name || 'Unassigned Department';
      if (!deptAcc.has(departmentName)) {
        deptAcc.set(departmentName, new Map());
      }

      const courseName = student.course_name || 'Unassigned Course';
      const courseMap = deptAcc.get(departmentName);
      if (!courseMap.has(courseName)) {
        courseMap.set(courseName, []);
      }
      courseMap.get(courseName).push(student);

      return deptAcc;
    }, new Map());

    return Array.from(departmentMap.entries())
      .sort(([aName], [bName]) => aName.localeCompare(bName))
      .map(([departmentName, courseMap]) => ({
        departmentName,
        courses: Array.from(courseMap.entries())
          .sort(([aName], [bName]) => aName.localeCompare(bName))
          .map(([courseName, studentsInCourse]) => ({
            courseName,
            students: studentsInCourse
          }))
      }));
  }, [filteredStudents, selectedDepartment, selectedCourse]);

  const escapeHtml = (value) => {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const buildPrintableReportHtml = (meta, studentsList) => {
    const renderRows = (list) =>
      list.length > 0
        ? list
            .map(
              (student, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapeHtml(student.name || 'N/A')}</td>
                  <td>${escapeHtml(student.age || 'N/A')}</td>
                  <td>${escapeHtml(student.gender || 'N/A')}</td>
                  <td>${escapeHtml(student.contact_number || 'N/A')}</td>
                </tr>
              `
            )
            .join('')
        : `
            <tr>
              <td colspan="5" class="empty">No student records available for this selection.</td>
            </tr>
          `;

    const renderCourseSection = (course, includeTitle = true) => `
      <section class="course-section">
        ${
          includeTitle
            ? `<h4 class="course-title">${escapeHtml(course.courseName || 'Course')}</h4>`
            : ''
        }
        <table>
          <thead>
            <tr>
              <th style="width:60px;">No.</th>
              <th>Student Name</th>
              <th style="width:80px;">Age</th>
              <th style="width:100px;">Gender</th>
              <th style="width:160px;">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(course.students || [])}
          </tbody>
        </table>
      </section>
    `;

    const renderBodyContent = () => {
      if (meta.grouping === 'departmentCourse' && Array.isArray(meta.departmentGroups) && meta.departmentGroups.length > 0) {
        return meta.departmentGroups
          .map((department, departmentIndex) => {
            const departmentHtml = `
              <section class="department-section">
                <h3 class="department-title">${escapeHtml(department.departmentName)}</h3>
                ${
                  Array.isArray(department.courses) && department.courses.length > 0
                    ? department.courses
                        .map((course) => renderCourseSection(course, true))
                        .join('')
                    : renderCourseSection({ students: [] }, false)
                }
              </section>
            `;
            return departmentIndex < meta.departmentGroups.length - 1
              ? departmentHtml + '<div class="page-break"></div>'
              : departmentHtml;
          })
          .join('');
      }

      if (meta.grouping === 'course' && Array.isArray(meta.courseGroups) && meta.courseGroups.length > 0) {
        return meta.courseGroups
          .map((course, index) => {
            const sectionHtml = renderCourseSection(course, true);
            return index < meta.courseGroups.length - 1
              ? sectionHtml + '<div class="page-break"></div>'
              : sectionHtml;
          })
          .join('');
      }

      return renderCourseSection({ students: studentsList }, false);
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(meta.departmentName)} Report</title>
          <style>
            * {
              box-sizing: border-box;
              font-family: 'Arial', sans-serif;
              color: #222;
            }
            body {
              margin: 0;
              background: #f5f5f5;
              padding: 20px 0;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: #ffffff;
              padding: 30mm 25mm;
              box-shadow: 0 10px 40px rgba(0,0,0,0.12);
              position: relative;
            }
            header {
              text-align: center;
              margin-bottom: 24px;
              border-bottom: 2px solid #2f3e9e;
              padding-bottom: 16px;
            }
            header h1 {
              margin: 0;
              font-size: 26px;
              letter-spacing: 1px;
              text-transform: uppercase;
              color: #2f3e9e;
            }
            header p {
              margin: 4px 0;
              font-size: 15px;
              color: #555;
            }
            .meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 14px;
              color: #444;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid rgba(0,0,0,0.15);
              padding: 10px 12px;
              text-align: left;
              font-size: 14px;
            }
            th {
              background: #f0f3ff;
              font-weight: 600;
              color: #2f3e9e;
            }
            tbody tr:nth-child(odd) {
              background: #fafbff;
            }
            tbody tr:nth-child(even) {
              background: #ffffff;
            }
            tbody tr:hover td {
              background: #eef2ff;
            }
            .empty {
              text-align: center;
              font-style: italic;
              color: #888;
              padding: 24px;
            }
            .department-section {
              margin-top: 32px;
              page-break-inside: avoid;
            }
            .department-section:first-of-type {
              margin-top: 0;
            }
            .department-title {
              margin: 0 0 16px;
              font-size: 20px;
              color: #1f2a7c;
              text-transform: uppercase;
              letter-spacing: 0.6px;
            }
            .course-section {
              margin-top: 24px;
              page-break-inside: avoid;
            }
            .course-section:first-of-type {
              margin-top: 0;
            }
            .department-section .course-section {
              margin-top: 18px;
            }
            .department-section .course-section:first-of-type {
              margin-top: 0;
            }
            .course-title {
              margin: 0 0 12px;
              font-size: 17px;
              color: #2f3e9e;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .page-break {
              page-break-after: always;
              height: 1px;
              width: 100%;
            }
            footer {
              position: absolute;
              bottom: 25mm;
              left: 25mm;
              right: 25mm;
              font-size: 12px;
              color: #888;
              display: flex;
              justify-content: space-between;
            }
            @media print {
              body {
                background: #ffffff;
                padding: 0;
              }
              .page {
                margin: 0;
                box-shadow: none;
                min-height: initial;
                height: auto;
              }
              footer {
                position: static;
                margin-top: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <header>
              <h1>${escapeHtml(meta.departmentName)}</h1>
              <p>${escapeHtml(meta.courseName)}</p>
            </header>
            <div class="meta">
              <span><strong>Generated:</strong> ${escapeHtml(meta.generatedAt)}</span>
            </div>
            ${renderBodyContent()}
            <footer>
              <span>Generated by Monitoring System</span>
              <span>Department Report</span>
            </footer>
          </div>
        </body>
      </html>
    `;
  };

  const handleGenerateReport = () => {
    if (filteredStudents.length === 0 || loading) {
      return;
    }

    const grouping =
      selectedDepartment === 'all'
        ? 'departmentCourse'
        : selectedCourse === 'all'
          ? 'course'
          : 'none';

    const reportMeta = {
      departmentName: getCurrentDepartmentName(),
      courseName: getCurrentCourseName(),
      generatedAt: new Date().toLocaleString(),
      grouping,
      departmentGroups:
        grouping === 'departmentCourse'
          ? departmentCourseSections.map((department) => ({
              departmentName: department.departmentName,
              courses: department.courses.map((course) => ({
                courseName: course.courseName,
                students: course.students
              }))
            }))
          : undefined,
      courseGroups:
        grouping === 'course'
          ? courseSections.map((section) => ({
              courseName: section.courseName,
              students: section.students
            }))
          : undefined
    };

    if (typeof window === 'undefined') {
      return;
    }

    const reportWindow = window.open('', '_blank', 'width=900,height=700');

    if (!reportWindow) {
      alert('The report window was blocked. Please allow pop-ups to generate the report.');
      return;
    }

    const reportHtml = buildPrintableReportHtml(reportMeta, filteredStudents);
    reportWindow.document.open();
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();

    reportWindow.focus();
    reportWindow.onload = () => {
      reportWindow.print();
    };
  };

  const getCurrentDepartmentName = () => {
    if (selectedDepartment === 'all') return 'All Departments';
    const dept = departments.find(d => d.department_id == selectedDepartment);
    return dept ? dept.department_name : 'All Departments';
  };

  const getCurrentCourseName = () => {
    if (selectedCourse === 'all') return 'All Courses';
    const course = courses.find(c => c.course_id == selectedCourse);
    return course ? course.course_name : 'All Courses';
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Student Report Generator</h4>
            </div>
            <div className="card-body" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label"><strong>Filter by Department:</strong></label>
                  <select 
                    className="form-select" 
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label"><strong>Filter by Course:</strong></label>
                  <select 
                    className="form-select" 
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                  >
                    <option value="all">All Courses</option>
                    {courses
                      .filter(c => selectedDepartment === 'all' || c.department_id == selectedDepartment)
                      .map(course => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12 d-flex justify-content-end">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleGenerateReport}
                    disabled={loading || filteredStudents.length === 0}
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Current Selection:</strong> {getCurrentDepartmentName()} → {getCurrentCourseName()}
                  </div>
                </div>
              </div>

              {/* Student Table Preview */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredStudents.length > 0 ? (
                selectedDepartment === 'all' ? (
                  <div className="d-flex flex-column gap-4">
                    {departmentCourseSections.map((department) => {
                      const departmentTotal = department.courses.reduce(
                        (sum, course) => sum + course.students.length,
                        0
                      );

                      return (
                        <div key={department.departmentName} className="border rounded-4 p-4 shadow-sm bg-white">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0 text-primary">{department.departmentName}</h4>
                            <span className="badge rounded-pill bg-primary">
                              {departmentTotal} {departmentTotal === 1 ? 'Student' : 'Students'}
                            </span>
                          </div>

                          <div className="d-flex flex-column gap-3">
                            {department.courses.map((course) => (
                              <div
                                key={`${department.departmentName}-${course.courseName}`}
                                className="border rounded-3 p-3 bg-light"
                              >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h5 className="mb-0">{course.courseName}</h5>
                                  <span className="badge rounded-pill bg-secondary">
                                    {course.students.length}{' '}
                                    {course.students.length === 1 ? 'Student' : 'Students'}
                                  </span>
                                </div>
                                <div className="table-responsive">
                                  <table className="table table-striped mb-0">
                                    <thead>
                                      <tr>
                                        <th>No.</th>
                                        <th>Student Name</th>
                                        <th>Age</th>
                                        <th>Gender</th>
                                        <th>Contact Number</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {course.students.map((student, index) => (
                                        <tr key={`${department.departmentName}-${course.courseName}-${index}`}>
                                          <td>{index + 1}</td>
                                          <td>{student.name || 'N/A'}</td>
                                          <td>{student.age || 'N/A'}</td>
                                          <td>{student.gender || 'N/A'}</td>
                                          <td>{student.contact_number || 'N/A'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : selectedCourse === 'all' ? (
                  <div className="d-flex flex-column gap-4">
                    {courseSections.map((section) => (
                      <div key={section.courseName} className="border rounded-3 p-3 shadow-sm bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">{section.courseName}</h5>
                          <span className="badge rounded-pill bg-primary">
                            {section.students.length} {section.students.length === 1 ? 'Student' : 'Students'}
                          </span>
                        </div>
                        <div className="table-responsive">
                          <table className="table table-striped mb-0">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Student Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Contact Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.students.map((student, index) => (
                                <tr key={`${section.courseName}-${index}`}>
                                  <td>{index + 1}</td>
                                  <td>{student.name || 'N/A'}</td>
                                  <td>{student.age || 'N/A'}</td>
                                  <td>{student.gender || 'N/A'}</td>
                                  <td>{student.contact_number || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Student Name</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Contact Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{student.name || 'N/A'}</td>
                            <td>{student.age || 'N/A'}</td>
                            <td>{student.gender || 'N/A'}</td>
                            <td>{student.contact_number || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="text-center py-5">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    No students found for the selected filters.
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reports Layout Component with Sidebar
function ReportsLayout() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6fb', overflowX: 'auto' }}>
      <Sidebar active="reports" width={280} />
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
                <i className="fas fa-chart-bar text-white" style={{ fontSize: '18px' }}></i>
              </div>
              <div>
                <h2 className="m-0 text-white fw-bold" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>Reports</h2>
                <small className="text-white-50" style={{ fontSize: '14px' }}>Generate and view system reports</small>
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

        {/* Reports Content */}
        <div className="p-4" style={{ width: '100%' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            padding: '24px',
            border: '1px solid rgba(0,0,0,0.05)',
            overflowX: 'visible',
            height: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div id="reports-content-container" style={{
              height: '100%',
              overflowY: 'auto',
              overflowX: 'visible',
              width: '100%'
            }}>
              <ReportsApp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mount the React app
export function mountReports() {
  const layoutContainer = document.getElementById('react-layout-root');
  if (!layoutContainer) {
    console.error('React layout container not found');
    return;
  }

  // Render the full layout with Header and Sidebar
  ReactDOM.render(<ReportsLayout />, layoutContainer);
}

// Export for global access
if (typeof window !== 'undefined') {
  window.mountReports = mountReports;
}
