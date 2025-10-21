import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// Simple Test Component
const SimpleReportsApp = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Computer Engineering' }
  ];

  const students = [
    { name: 'John Doe', age: 20, gender: 'Male' },
    { name: 'Jane Smith', age: 19, gender: 'Female' },
    { name: 'Bob Johnson', age: 21, gender: 'Male' }
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">✅ React Component Working!</h4>
            </div>
            <div className="card-body">
              <div className="alert alert-success">
                <strong>Success!</strong> The React component has loaded successfully.
              </div>
              
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Department Filter:</label>
                  <select 
                    className="form-select" 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index}>
                        <td>{student.name}</td>
                        <td>{student.age}</td>
                        <td>{student.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mount function using React 18 createRoot API
const mountSimpleReports = (containerId = 'react-reports-root') => {
  const container = document.getElementById(containerId);
  if (container) {
    try {
      // Use React 18 createRoot API
      const root = ReactDOM.createRoot(container);
      root.render(<SimpleReportsApp />);
      console.log('React component mounted successfully to:', containerId);
    } catch (error) {
      console.error('Error mounting React component:', error);
      // Note: React 18 createRoot should work with CDN React 18
      console.log('Please ensure you are using React 18 CDN versions');
    }
  } else {
    console.error(`Container with ID '${containerId}' not found`);
  }
};

// Export to window - multiple ways to ensure it works
window.ReactReports = {
  mountSimpleReports
};

// Also export directly to window as backup
window.mountSimpleReports = mountSimpleReports;

console.log('React component script loaded, ReactReports object created');
console.log('Available methods:', Object.keys(window.ReactReports));
