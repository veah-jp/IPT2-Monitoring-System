<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Reports - Student and Faculty Management System</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
    <style>
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .report-content {
            display: none;
        }
        
        .report-content.active {
            display: block;
        }
        
        .nav-tabs .nav-link {
            cursor: pointer;
        }
        
        .nav-tabs .nav-link.active {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }
        
        .card {
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            border: 1px solid rgba(0, 0, 0, 0.125);
        }
        
        .card-header {
            background-color: #f8f9fa;
            border-bottom: 1px solid rgba(0, 0, 0, 0.125);
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            background-color: #28a745;
        }
        
        .notification-error {
            background-color: #dc3545;
        }
        
        .notification-info {
            background-color: #17a2b8;
        }

        /* A4 Report Styling */
        .a4-report-paper {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20mm;
            font-family: 'Times New Roman', serif;
            position: relative;
        }

        .report-header {
            border-bottom: 2px solid #333;
            margin-bottom: 20px;
            padding-bottom: 15px;
        }

        .report-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .report-subtitle {
            font-size: 16px;
            font-weight: bold;
            color: #666;
            margin-bottom: 10px;
        }

        .report-info {
            font-size: 12px;
            color: #666;
        }

        .student-report-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
        }

        .student-report-table th,
        .student-report-table td {
            border: 1px solid #333;
            padding: 8px 4px;
            text-align: left;
            vertical-align: top;
        }

        .student-report-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: center;
            font-size: 12px;
        }

        .student-report-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .student-report-table .col-no {
            width: 5%;
            text-align: center;
        }

        .student-report-table .col-name {
            width: 25%;
        }

        .student-report-table .col-age {
            width: 8%;
            text-align: center;
        }

        .student-report-table .col-gender {
            width: 10%;
            text-align: center;
        }

        .student-report-table .col-contact {
            width: 20%;
        }

        .student-report-table .col-email {
            width: 32%;
        }

        .report-footer {
            margin-top: 30px;
            font-size: 12px;
        }

        .signature-section {
            margin-top: 20px;
        }

        .signature-line {
            border-bottom: 1px solid #333;
            display: inline-block;
            width: 200px;
            margin-bottom: 5px;
        }

        .course-filter-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        /* Print Styles */
        @media print {
            body * {
                visibility: hidden;
            }
            
            .a4-report-paper, .a4-report-paper * {
                visibility: visible;
            }
            
            .a4-report-paper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 15mm;
                box-shadow: none;
            }
            
            .course-filter-section {
                display: none !important;
            }
            
            .student-report-table {
                font-size: 10px;
            }
            
            .student-report-table th,
            .student-report-table td {
                padding: 6px 3px;
            }
        }

        /* Responsive adjustments */
        @media screen and (max-width: 768px) {
            .a4-report-paper {
                width: 100%;
                margin: 0;
                padding: 15px;
            }
            
            .student-report-table {
                font-size: 10px;
            }
            
            .student-report-table th,
            .student-report-table td {
                padding: 5px 3px;
            }
        }
    </style>
</head>
<body>
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h2>Student and Faculty<br>Management System</h2>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li>
                    <a href="{{ route('dashboard') }}">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li>
                    <a href="{{ route('students') }}">
                        <i class="fas fa-users"></i>
                        <span>Students</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li>
                    <a href="{{ route('faculty') }}">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span>Faculty</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li class="active">
                    <a href="{{ route('reports') }}">
                        <i class="fas fa-chart-bar"></i>
                        <span>Reports</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li>
                    <a href="{{ route('settings') }}">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li>
                    <a href="{{ route('account') }}">
                        <i class="fas fa-user"></i>
                        <span>Account</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>

    <main class="main-content">
        <header class="main-header">
            <div class="header-content">
                <button id="sidebarToggle" class="sidebar-toggle">
                    <i class="fas fa-bars"></i>
                </button>
                <h1>Reports</h1>
                <div class="user-profile">
                    <div class="profile-dropdown">
                        <button type="button" class="profile-button" id="profile-menu-button" aria-expanded="false" aria-haspopup="true">
                            <i class="fas fa-user-circle"></i>
                                                         <span class="user-name">{{ Auth::user()->first_name ?? Auth::user()->username ?? 'User' }}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        
                        <div class="profile-dropdown-menu" id="profile-dropdown-menu" role="menu" aria-orientation="vertical" aria-labelledby="profile-menu-button" tabindex="-1">
                                                         <a href="{{ route('account') }}" class="dropdown-item" role="menuitem" tabindex="-1">
                                 <i class="fas fa-user"></i> Account
                             </a>
                            <div class="dropdown-divider"></div>
                            <form method="POST" action="{{ route('logout') }}" class="dropdown-form">
                                @csrf
                                <button type="submit" class="dropdown-item logout-button" role="menuitem" tabindex="-1">
                                    <i class="fas fa-sign-out-alt"></i> Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="dashboard-content">
            <div class="container-fluid">
                <!-- Loading Overlay -->
                <div id="loadingOverlay" class="loading-overlay" style="display: none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <!-- Filter Controls -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0"><i class="fas fa-filter me-2"></i>Report Filters</h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        <label for="dateRangeFilter" class="form-label">Date Range</label>
                                        <select class="form-select" id="dateRangeFilter">
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="week">This Week</option>
                                            <option value="month">This Month</option>
                                            <option value="year">This Year</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="departmentFilter" class="form-label">Department</label>
                                        <select class="form-select" id="departmentFilter">
                                            <option value="all">All Departments</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="courseFilter" class="form-label">Course</label>
                                        <select class="form-select" id="courseFilter">
                                            <option value="all">All Courses</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label for="statusFilter" class="form-label">Status</label>
                                        <select class="form-select" id="statusFilter">
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <button id="refreshReportsBtn" class="btn btn-primary me-2">
                                            <i class="fas fa-sync-alt me-1"></i>Refresh Reports
                                        </button>
                                        <button id="exportPdfBtn" class="btn btn-success me-2">
                                            <i class="fas fa-file-pdf me-1"></i>Export PDF
                                        </button>
                                        <button id="exportExcelBtn" class="btn btn-warning me-2">
                                            <i class="fas fa-file-excel me-1"></i>Export Excel
                                        </button>
                                        <button id="exportCsvBtn" class="btn btn-info">
                                            <i class="fas fa-file-csv me-1"></i>Export CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="row mb-4">
                    <div class="col-md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-users fa-2x text-primary mb-2"></i>
                                <h4 id="totalStudents">0</h4>
                                <p class="text-muted mb-0">Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-chalkboard-teacher fa-2x text-success mb-2"></i>
                                <h4 id="totalFaculty">0</h4>
                                <p class="text-muted mb-0">Total Faculty</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-book fa-2x text-warning mb-2"></i>
                                <h4 id="totalCourses">0</h4>
                                <p class="text-muted mb-0">Total Courses</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-building fa-2x text-info mb-2"></i>
                                <h4 id="totalDepartments">0</h4>
                                <p class="text-muted mb-0">Total Departments</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="fas fa-chart-line fa-2x text-danger mb-2"></i>
                                <h4 id="enrollmentRate">0%</h4>
                                <p class="text-muted mb-0">Enrollment Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Type Tabs -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <ul class="nav nav-tabs card-header-tabs" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active report-tab-btn" data-report-type="overview" type="button" role="tab">
                                            <i class="fas fa-chart-pie me-1"></i>Overview
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link report-tab-btn" data-report-type="students" type="button" role="tab">
                                            <i class="fas fa-users me-1"></i>Students
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link report-tab-btn" data-report-type="faculty" type="button" role="tab">
                                            <i class="fas fa-chalkboard-teacher me-1"></i>Faculty
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link report-tab-btn" data-report-type="enrollments" type="button" role="tab">
                                            <i class="fas fa-graduation-cap me-1"></i>Enrollments
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div class="card-body">
                                <!-- Overview Tab -->
                                <div id="overviewReport" class="report-content active">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="mb-0">Department Distribution</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="departmentChart" width="400" height="200"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="mb-0">Course Enrollment</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="courseEnrollmentChart" width="400" height="200"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-4">
                                        <div class="col-12">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h6 class="mb-0">Student Growth Trend</h6>
                                                </div>
                                                <div class="card-body">
                                                    <canvas id="studentGrowthChart" width="400" height="200"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Students Tab -->
                                <div id="studentsReport" class="report-content" style="display: none;">
                                    <div class="student-report-container">
                                        <!-- Department Filter -->
                                        <div class="department-filter-section mb-4">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label for="departmentFilterReport" class="form-label"><strong>Filter by Department:</strong></label>
                                                    <select class="form-select" id="departmentFilterReport">
                                                        <option value="all">All Departments</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-8 d-flex align-items-end">
                                                    <button id="printReportBtn" class="btn btn-primary me-2">
                                                        <i class="fas fa-print me-1"></i>Print Report
                                                    </button>
                                                    <button id="exportReportBtn" class="btn btn-success">
                                                        <i class="fas fa-download me-1"></i>Export PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- A4 Student Report -->
                                        <div class="a4-report-paper" id="studentReportPaper">
                                            <!-- Report Header -->
                                            <div class="report-header">
                                                <div class="text-center mb-4">
                                                    <h2 class="report-title">Student and Faculty Management System</h2>
                                                    <h3 class="report-subtitle">Student Report</h3>
                                                    <div class="report-info">
                                                        <span id="reportDepartmentInfo">Department: All Departments</span> | 
                                                        <span id="reportDate">Date: {{ date('F d, Y') }}</span> | 
                                                        <span id="reportTotalStudents">Total Students: 0</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Student Table -->
                                            <div class="student-table-container">
                                                <table class="student-report-table">
                                                    <thead>
                                                        <tr>
                                                            <th class="col-no">No.</th>
                                                            <th class="col-name">Student Name</th>
                                                            <th class="col-age">Age</th>
                                                            <th class="col-gender">Gender</th>
                                                            <th class="col-contact">Contact Number</th>
                                                            <th class="col-email">Email Address</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="studentReportTableBody">
                                                        <tr>
                                                            <td colspan="6" class="text-center text-muted">Loading student data...</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <!-- Report Footer -->
                                            <div class="report-footer mt-4">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <div class="signature-section">
                                                            <div class="signature-line mt-4">
                                                                <span>Prepared by: _________________________</span>
                                                            </div>
                                                            <div class="signature-date mt-2">
                                                                <span>Date: _________________________</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="signature-section">
                                                            <div class="signature-line mt-4">
                                                                <span>Approved by: _________________________</span>
                                                            </div>
                                                            <div class="signature-date mt-2">
                                                                <span>Date: _________________________</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Faculty Tab -->
                                <div id="facultyReport" class="report-content" style="display: none;">
                                    <div class="table-responsive">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Faculty ID</th>
                                                    <th>Name</th>
                                                    <th>Department</th>
                                                    <th>Specialization</th>
                                                    <th>Hire Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody id="facultyTableBody">
                                                <tr>
                                                    <td colspan="6" class="text-center text-muted">No data available</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Enrollments Tab -->
                                <div id="enrollmentsReport" class="report-content" style="display: none;">
                                    <div class="table-responsive">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Enrollment ID</th>
                                                    <th>Student</th>
                                                    <th>Course</th>
                                                    <th>Department</th>
                                                    <th>Enrollment Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody id="enrollmentTableBody">
                                                <tr>
                                                    <td colspan="6" class="text-center text-muted">No data available</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Chart.js for charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Custom JS -->
    <script src="{{ asset('js/sidebar.js') }}"></script>
    <script src="{{ asset('js/reports.js') }}"></script>
</body>
</html>
