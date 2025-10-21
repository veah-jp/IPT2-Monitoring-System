<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Settings - Student and Faculty Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
    <style>
        .settings-tab {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
            height: 100%;
        }
        
        .settings-tab:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border-color: #2196f3;
        }
        
        .settings-tab.active {
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            border-color: #2196f3;
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
        }
        
        .settings-tab .tab-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #6c757d;
        }
        
        .settings-tab.active .tab-icon {
            color: white;
        }
        
        .settings-tab h5 {
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .settings-tab p {
            margin-bottom: 0;
            opacity: 0.8;
        }
        
        .settings-content {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            min-height: 500px;
        }
        
        .action-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 1px solid #e9ecef;
            border-radius: 12px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .action-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            border-color: #2196f3;
        }
        
        .action-card.active {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            border-color: #2196f3;
            background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
        }
        
        .action-card .card-body {
            padding: 1.5rem;
        }
        
        .action-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .add-icon { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; }
        .edit-icon { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; }
        .archive-icon { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; }
        .view-icon { background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white; }
        
        .stats-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
        }
        
        /* Enhanced Department Table Styling */
        #editDepartmentsTable {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        #editDepartmentsTable thead th {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-bottom: 2px solid #dee2e6;
            font-weight: 600;
            color: #495057;
            padding: 12px 16px;
        }
        
        #editDepartmentsTable tbody td {
            padding: 12px 16px;
            vertical-align: middle;
            border-bottom: 1px solid #f1f3f4;
        }
        
        #editDepartmentsTable tbody tr:hover {
            background-color: #f8f9fa;
            transform: scale(1.01);
            transition: all 0.2s ease;
        }
        
        #editDepartmentsTable .btn-group .btn {
            margin: 0 2px;
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        #editDepartmentsTable .btn-group .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        /* Department Code styling */
        #editDepartmentsTable td:first-child span {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        /* Department Name styling */
        #editDepartmentsTable td:nth-child(2) span {
            color: #2c3e50;
            font-weight: 600;
        }
        
        /* Description styling */
        #editDepartmentsTable td:nth-child(3) span {
            color: #6c757d;
            font-style: italic;
            line-height: 1.4;
        }
        
        /* Archive table styling */
        #departmentArchivesTable {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        #departmentArchivesTable thead th {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-bottom: 2px solid #dee2e6;
            font-weight: 600;
            color: #495057;
            padding: 12px 16px;
        }
        
        #departmentArchivesTable .badge {
            font-size: 0.8rem;
            padding: 6px 10px;
            border-radius: 6px;
        }
        
        /* Enhanced Course Table Styling */
        #editCoursesTable {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        #editCoursesTable thead th {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-bottom: 2px solid #dee2e6;
            font-weight: 600;
            color: #495057;
            padding: 12px 16px;
        }
        
        #editCoursesTable tbody td {
            padding: 12px 16px;
            vertical-align: middle;
            border-bottom: 1px solid #f1f3f4;
        }
        
        #editCoursesTable tbody tr:hover {
            background-color: #f8f9fa;
            transform: scale(1.01);
            transition: all 0.2s ease;
        }
        
        #editCoursesTable .btn-group .btn {
            margin: 0 2px;
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        #editCoursesTable .btn-group .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        /* Course Code styling */
        #editCoursesTable td:first-child span {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            padding: 4px 8px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        /* Course Name styling */
        #editCoursesTable td:nth-child(2) span {
            color: #2c3e50;
            font-weight: 600;
        }
        
        /* Department styling */
        #editCoursesTable td:nth-child(3) span {
            color: #6c757d;
            font-weight: 500;
        }
        
        /* Credits styling */
        #editCoursesTable td:nth-child(4) span {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
            color: #856404;
        }
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .stats-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .stats-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
                /* Table row highlighting for edit mode */
        .table-warning {
            background-color: #fff3cd !important;
            border-color: #ffeaa7 !important;
            box-shadow: 0 0 10px rgba(255, 193, 7, 0.3) !important;
            transition: all 0.3s ease;
        }
        
        .table-warning:hover {
            background-color: #ffeaa7 !important;
            box-shadow: 0 0 15px rgba(255, 193, 7, 0.5) !important;
        }
        
        .section-header {
            background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border-left: 4px solid #2196f3;
        }
        
        .header-icon {
            font-size: 1.5rem;
        }
        
        .settings-container {
            background: #f8f9fa;
            min-height: 100vh;
            padding: 2rem 0;
        }
        
        .settings-wrapper {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .tab-navigation {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .actions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        
        .action-card:hover .action-icon {
            transform: scale(1.1);
        }
        
        .action-card:hover .btn {
            transform: translateY(-2px);
        }
        
        .btn {
            transition: all 0.3s ease;
        }
        
        .stats-card {
            position: relative;
            overflow: hidden;
        }
        
        .stats-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.6s ease;
        }
        
        .stats-card:hover::before {
            left: 100%;
        }
        
        .settings-tab {
            position: relative;
            overflow: hidden;
        }
        
        .settings-tab::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 3px;
            background: #2196f3;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .settings-tab.active::after {
            width: 100%;
        }
        
        .tab-content {
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .responsive-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
            .responsive-grid {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
            
            .actions-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
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
                <li>
                    <a href="{{ route('reports') }}">
                        <i class="fas fa-chart-bar"></i>
                        <span>Reports</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li class="active">
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
                <h1>System Settings</h1>
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
                <div class="settings-container">
                    <!-- Header Section -->
                    <div class="settings-wrapper">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-cog me-3 text-primary header-icon"></i>
                                <h2 class="mb-0">System Settings</h2>
                            </div>
                            <div class="user-profile">
                                <i class="fas fa-user-circle text-primary header-icon"></i>
                            </div>
                        </div>

                        <!-- Top Navigation Tabs -->
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <div class="settings-tab active" data-tab="course" data-content="courseContent" style="cursor: pointer;">
                                    <div class="tab-icon">
                                        <i class="fas fa-book"></i>
                                    </div>
                                    <h5>Course Management</h5>
                                    <p>Manage courses</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="settings-tab" data-tab="department" data-content="departmentContent" style="cursor: pointer;">
                                    <div class="tab-icon">
                                        <i class="fas fa-building"></i>
                                    </div>
                                    <h5>Department Management</h5>
                                    <p>Manage departments</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="settings-tab" data-tab="student-archives" data-content="studentArchivesContent" style="cursor: pointer;">
                                    <div class="tab-icon">
                                        <i class="fas fa-archive"></i>
                                    </div>
                                    <h5>Student Archives</h5>
                                    <p>View archived students</p>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="settings-tab" data-tab="faculty-archives" data-content="facultyArchivesContent" style="cursor: pointer;">
                                    <div class="tab-icon">
                                        <i class="fas fa-archive"></i>
                                    </div>
                                    <h5>Faculty Archives</h5>
                                    <p>View archived faculty</p>
                                </div>
                            </div>
                        </div>

                        <!-- Content will be displayed here when tabs are clicked -->
                        <div id="contentArea" class="mt-4">
                            <!-- Content sections will be shown here -->
                        </div>

                        <!-- Course Content Section -->
                        <div id="courseContent" class="mt-4" style="display: none;">
                            <!-- Course Management Header -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h5><i class="fas fa-book me-2"></i>Course Management</h5>
                                    <p class="mb-0">Add, edit, and archive course information</p>
                                </div>
                            </div>

                            <!-- Add Course Form -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6><i class="fas fa-plus me-2"></i>Add New Course</h6>
                                </div>
                                <div class="card-body">
                                    <form id="addCourseForm">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="course_code" class="form-label">Course Code</label>
                                                <input type="text" class="form-control" id="course_code" name="course_code" required maxlength="20" placeholder="e.g., CS101">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="course_name" class="form-label">Course Name</label>
                                                <input type="text" class="form-control" id="course_name" name="course_name" required maxlength="255" placeholder="e.g., Introduction to Computer Science">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="department_id" class="form-label">Department</label>
                                                <select class="form-select" id="department_id" name="department_id" required>
                                                    <option value="">Select Department</option>
                                                    @foreach($departments as $dept)
                                                        <option value="{{ $dept->department_id }}">{{ $dept->department_name }}</option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="credits" class="form-label">Credits</label>
                                                <input type="number" class="form-control" id="credits" name="credits" required min="1" max="30" placeholder="e.g., 3">
                                            </div>
                                        </div>
                                        <div class="d-flex gap-2">
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save me-1"></i>Add Course
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <!-- Edit Courses Table -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6><i class="fas fa-edit me-2"></i>Edit Courses</h6>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="courseSearch" placeholder="Search courses...">
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="editCoursesTable">
                                            <thead>
                                                <tr>
                                                    <th>Course Code</th>
                                                    <th>Course Name</th>
                                                    <th>Department</th>
                                                    <th>Credits</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Course data will be populated here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- Course Archives -->
                            <div class="card">
                                <div class="card-header">
                                    <h6><i class="fas fa-archive me-2"></i>Course Archives</h6>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="courseArchiveSearch" placeholder="Search archived courses...">
                                    </div>
                                    <div id="courseArchivesLoading" class="text-center" style="display: none;">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="courseArchivesTable" style="display: none;">
                                            <thead>
                                                <tr>
                                                    <th>Course Code</th>
                                                    <th>Course Name</th>
                                                    <th>Department</th>
                                                    <th>Credits</th>
                                                    <th>Archived Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Archived course data will be populated here -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="noCourseArchives" class="text-center text-muted" style="display: none;">
                                        <i class="fas fa-archive fa-3x mb-3"></i>
                                        <p>No archived courses found</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Department Content Section -->
                        <div id="departmentContent" class="mt-4" style="display: none;">
                            <!-- Department Management Header -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h5><i class="fas fa-building me-2"></i>Department Management</h5>
                                    <p class="mb-0">Add, edit, and archive department information</p>
                                </div>
                            </div>

                            <!-- Add Department Form -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6><i class="fas fa-plus me-2"></i>Add New Department</h6>
                                </div>
                                <div class="card-body">
                                    <form id="addDepartmentForm">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="department_code" class="form-label">Department Code</label>
                                                <input type="text" class="form-control" id="department_code" name="department_code" required maxlength="20" placeholder="e.g., CS">
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="department_name" class="form-label">Department Name</label>
                                                <input type="text" class="form-control" id="department_name" name="department_name" required maxlength="255" placeholder="e.g., Computer Science">
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="description" class="form-label">Description</label>
                                            <textarea class="form-control" id="description" name="description" rows="3" placeholder="Enter department description..."></textarea>
                                        </div>
                                        <div class="d-flex gap-2">
                                            <button type="submit" class="btn btn-primary">
                                                <i class="fas fa-save me-1"></i>Add Department
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <!-- Edit Departments Table -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6><i class="fas fa-edit me-2"></i>Edit Departments</h6>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="departmentSearch" placeholder="Search departments...">
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="editDepartmentsTable">
                                            <thead>
                                                <tr>
                                                    <th>Department Code</th>
                                                    <th>Department Name</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Department data will be populated here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- Department Archives -->
                            <div class="card">
                                <div class="card-header">
                                    <h6><i class="fas fa-archive me-2"></i>Department Archives</h6>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="departmentArchiveSearch" placeholder="Search archived departments...">
                                    </div>
                                    <div id="departmentArchivesLoading" class="text-center" style="display: none;">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="departmentArchivesTable" style="display: none;">
                                            <thead>
                                                <tr>
                                                    <th>Department Code</th>
                                                    <th>Department Name</th>
                                                    <th>Description</th>
                                                    <th>Archived Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Archived department data will be populated here -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="noDepartmentArchives" class="text-center text-muted" style="display: none;">
                                        <i class="fas fa-archive fa-3x mb-3"></i>
                                        <p>No archived departments found</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Student Archives Content Section -->
                        <div id="studentArchivesContent" class="mt-4" style="display: none;">
                            <div class="card">
                                <div class="card-header">
                                    <h5><i class="fas fa-archive me-2"></i>Student Archives</h5>
                                    <p class="mb-0">View and restore archived student records</p>
                                </div>
                                <div class="card-body">
                                    <!-- Search -->
                                    <div class="row mb-3">
                                        <div class="col-md-9">
                                            <input type="text" class="form-control" id="studentArchiveSearch" placeholder="Search students...">
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-outline-secondary" id="clearStudentArchiveFilters">
                                                <i class="fas fa-times me-1"></i>Clear Search
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- Loading Spinner -->
                                    <div id="studentArchivesLoading" class="text-center" style="display: none;">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Archives Table -->
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="studentArchivesTable" style="display: none;">
                                            <thead>
                                                <tr>
                                                    <th>Student ID</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Course</th>
                                                    <th>Department</th>
                                                    <th>Gender</th>
                                                    <th>Date of Birth</th>
                                                    <th>Address</th>
                                                    <th>Year</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="studentArchivesTableBody">
                                                <!-- Archived student data will be populated here -->
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <!-- No Results Message -->
                                    <div id="noStudentArchives" class="text-center text-muted" style="display: none;">
                                        <i class="fas fa-archive fa-3x mb-3"></i>
                                        <p>No archived students found</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Faculty Archives Content Section -->
                        <div id="facultyArchivesContent" class="mt-4" style="display: none;">
                            <div class="card">
                                <div class="card-header">
                                    <h5><i class="fas fa-archive me-2"></i>Faculty Archives</h5>
                                    <p class="mb-0">View and restore archived faculty records</p>
                                </div>
                                <div class="card-body">
                                    <!-- Search -->
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="facultyArchiveSearch" placeholder="Search faculty...">
                                    </div>
                                    
                                    <!-- Loading Spinner -->
                                    <div id="facultyArchivesLoading" class="text-center" style="display: none;">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Archives Table -->
                                    <div class="table-responsive">
                                        <table class="table table-striped" id="facultyArchivesTable" style="display: none;">
                                            <thead>
                                                <tr>
                                                    <th>Faculty ID</th>
                                                    <th>First Name</th>
                                                    <th>Last Name</th>
                                                    <th>Department</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Gender</th>
                                                    <th>Date of Birth</th>
                                                    <th>Hire Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Archived faculty data will be populated here -->
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    <!-- No Results Message -->
                                    <div id="noFacultyArchives" class="text-center text-muted" style="display: none;">
                                        <i class="fas fa-archive fa-3x mb-3"></i>
                                        <p>No archived faculty found</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </main>




    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/sidebar.js') }}"></script>
    <script src="{{ asset('js/courseManagement.js') }}"></script>
    <script src="{{ asset('js/departmentManagement.js') }}"></script>
    <script src="{{ asset('js/studentArchives.js') }}"></script>
    <script src="{{ asset('js/facultyArchives.js') }}"></script>
    <script src="{{ asset('js/settings.js') }}"></script>
</body>
</html>
