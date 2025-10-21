<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Student and Faculty Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
</head>
<body>
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h2>Student and Faculty<br>Management System</h2>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li class="active">
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
                <h1>Dashboard</h1>
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
            <!-- Top Section with Summary Cards and Chart -->
            <section class="top-section">
                <div class="row">
                    <!-- Left Column - Summary Cards -->
                    <div class="col-md-4">
                        <div class="summary-cards-container">
                            <div class="summary-card">
                                <div class="card-content">
                                    <h3 id="totalStudents">0</h3>
                                    <p>Total Students</p>
                                </div>
                            </div>
                            <div class="summary-card">
                                <div class="card-content">
                                    <h3 id="totalFaculty">0</h3>
                                    <p>Total Faculty</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column - Department Selector and Charts -->
                    <div class="col-md-8">
                        <!-- Student Bar Chart -->
                        <div class="chart-card">
                            <div class="chart-header" id="chartHeader">
                                <button id="backToAllDepartments" class="btn btn-sm btn-outline-secondary" style="display:none;">
                                    <i class="fas fa-arrow-left"></i> Back
                                </button>
                                <h3><i class="fas fa-chart-bar"></i> Student Enrollment by Course</h3>
                                <p>Number of students enrolled in each course</p>
                            </div>
                            <div class="chart-content">
                                <canvas id="enrollmentBarChart" width="400" height="200"></canvas>
                            </div>
                        </div>

                        <!-- Faculty Bar Chart (always visible below) -->
                        <div class="chart-card" style="margin-top:16px;">
                            <div class="chart-header">
                                <h3><i class="fas fa-chart-bar"></i> Faculty Distribution by Department</h3>
                                <p>Number of faculty members in each department</p>
                            </div>
                            <div class="chart-content">
                                <canvas id="facultyBarChart" width="400" height="200"></canvas>
                            </div>
                        </div>

                        <!-- Department Selector below Charts -->
                        <div class="chart-controls">
                            <div class="department-dropdown-container">
                                <select id="departmentSelect" class="form-control department-select">
                                    <option value="">Select Department</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="{{ asset('js/sidebar.js') }}"></script>
    <script src="{{ asset('js/dashboard.js') }}"></script>
</body>
</html>
