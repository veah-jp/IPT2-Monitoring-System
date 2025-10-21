import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better PDF rendering
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfB.ttf', fontWeight: 'bold' }
  ]
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555'
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20
  },
  divider: {
    borderBottom: '1px solid #ccc',
    marginBottom: 20
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#bfbfbf',
    fontSize: 10
  },
  colNo: { width: '8%', textAlign: 'center' },
  colName: { width: '25%' },
  colAge: { width: '8%', textAlign: 'center' },
  colGender: { width: '12%', textAlign: 'center' },
  colContact: { width: '22%' },
  colEmail: { width: '25%' },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signature: {
    width: '45%'
  },
  signatureLine: {
    borderBottom: '1px solid #000',
    marginBottom: 5,
    height: 20
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 5
  }
});

// PDF Document Component
const StudentReportPDF = ({ students, department, date }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Student and Faculty Management System</Text>
        <Text style={styles.subtitle}>Student Report</Text>
        <Text style={styles.info}>
          Department: {department} | Date: {date} | Total Students: {students.length}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      {/* Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.colNo]}>No.</Text>
          <Text style={[styles.tableCell, styles.colName]}>Student Name</Text>
          <Text style={[styles.tableCell, styles.colAge]}>Age</Text>
          <Text style={[styles.tableCell, styles.colGender]}>Gender</Text>
          <Text style={[styles.tableCell, styles.colContact]}>Contact Number</Text>
          <Text style={[styles.tableCell, styles.colEmail]}>Email Address</Text>
        </View>
        
        {/* Data Rows */}
        {students.map((student, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colNo]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.colName]}>{student.name || 'N/A'}</Text>
            <Text style={[styles.tableCell, styles.colAge]}>{student.age || 'N/A'}</Text>
            <Text style={[styles.tableCell, styles.colGender]}>{student.gender || 'N/A'}</Text>
            <Text style={[styles.tableCell, styles.colContact]}>{student.contact_number || 'N/A'}</Text>
            <Text style={[styles.tableCell, styles.colEmail]}>{student.email_address || 'N/A'}</Text>
          </View>
        ))}
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.signature}>
          <Text style={styles.signatureText}>Prepared by:</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Date:</Text>
          <View style={styles.signatureLine} />
        </View>
        <View style={styles.signature}>
          <Text style={styles.signatureText}>Approved by:</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Date:</Text>
          <View style={styles.signatureLine} />
        </View>
      </View>
    </Page>
  </Document>
);

// Main Reports Component
const ReportsApp = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedDepartment, selectedCourse, students]);

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
      await loadStudentData();
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async () => {
    try {
      const response = await fetch('/api/reports/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ department: selectedDepartment })
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.details?.students || []);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];
    
    if (selectedDepartment !== 'all') {
      const dept = departments.find(d => d.department_id == selectedDepartment);
      if (dept) {
        filtered = filtered.filter(s => s.department_name === dept.department_name);
      }
    }
    
    if (selectedCourse !== 'all') {
      const course = courses.find(c => c.course_id == selectedCourse);
      if (course) {
        filtered = filtered.filter(s => s.course_name === course.course_name);
      }
    }
    
    setFilteredStudents(filtered);
  };

  const handleDepartmentChange = async (deptId) => {
    setSelectedDepartment(deptId);
    setSelectedCourse('all');
    if (deptId !== 'all') {
      await loadStudentData();
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
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
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4 d-flex align-items-end">
                  <PDFDownloadLink
                    document={
                      <StudentReportPDF 
                        students={filteredStudents}
                        department={getCurrentDepartmentName()}
                        date={new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      />
                    }
                    fileName={`student_report_${selectedDepartment}_${new Date().toISOString().split('T')[0]}.pdf`}
                    className="btn btn-primary"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? 'Generating PDF...' : 'Download PDF Report'
                    }
                  </PDFDownloadLink>
                </div>
              </div>

              {/* Results Summary */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Current Selection:</strong> {getCurrentDepartmentName()} → {getCurrentCourseName()}
                    <br />
                    <strong>Total Students:</strong> {filteredStudents.length}
                  </div>
                </div>
              </div>

              {/* Student Table Preview */}
              {filteredStudents.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Student Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Contact Number</th>
                        <th>Email Address</th>
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
                          <td>{student.email_address || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
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

// Mount the React app
const mountReports = () => {
  const container = document.getElementById('react-reports-container');
  if (container) {
    ReactDOM.render(<ReportsApp />, container);
  }
};

// Export for global access
window.mountReports = mountReports;
