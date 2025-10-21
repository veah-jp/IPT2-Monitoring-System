<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Faculty - Student and Faculty Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
    <style>
        .editable-text {
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .editable-text:hover {
            background-color: #f8f9fa;
            border-radius: 4px;
            padding: 2px 4px;
        }
        
        .editable-input {
            border: 2px solid #007bff;
            border-radius: 4px;
        }
        
        .edit-row-btn, .save-row-btn, .cancel-row-btn {
            margin: 0 2px;
        }
        
        .table td {
            position: relative;
        }
        
        .editable-text.badge {
            cursor: pointer;
        }
        
        .editable-text.badge:hover {
            opacity: 0.8;
            transform: scale(1.05);
        }
        
        .editing-row {
            background: linear-gradient(45deg, #f8f9fa, #e3f2fd, #f8f9fa) !important;
            box-shadow: 0 0 15px rgba(33, 150, 243, 0.3) !important;
            border: 2px solid #2196f3 !important;
            transition: all 0.3s ease;
        }
        
        .editing-row:hover {
            box-shadow: 0 0 20px rgba(33, 150, 243, 0.5) !important;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            padding: 1rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }

        .notification.error {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .notification.info {
            background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
        }

        .d-none {
            display: none !important;
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
                <li class="active">
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
                <h1>Faculty Members</h1>
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
                <!-- Header Section -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-chalkboard-teacher me-3 text-primary" style="font-size: 1.5rem;"></i>
                        <h2 class="mb-0">Faculty</h2>
                    </div>
                    <div class="user-profile">
                        <i class="fas fa-user-circle text-primary" style="font-size: 1.5rem;"></i>
                    </div>
                </div>

                <!-- Search and Filter Section -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0">
                                <i class="fas fa-search text-muted"></i>
                            </span>
                            <input type="text" class="form-control border-start-0" placeholder="Search Faculty" id="facultySearch">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <select class="form-select" id="departmentFilter">
                            <option value="">Filter by Department</option>
                            @foreach($departments as $dept)
                                <option value="{{ $dept->department_id }}">{{ $dept->department_name }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-primary" id="addFacultyBtn">
                                <i class="fas fa-plus me-2"></i>Add Faculty
                            </button>
                            <button type="button" class="btn btn-outline-secondary" id="editFacultyBtn">
                                <i class="fas fa-user-edit me-2"></i>Edit Faculty
                            </button>
                            <button type="button" class="btn btn-outline-info active" id="archiveFacultyBtn">
                                <i class="fas fa-user me-2"></i>Archive Faculty
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Edit Mode Button (Hidden by default) -->
                <div class="row mb-4" id="editModeRow" style="display: none;">
                    <div class="col-12">
                        <button type="button" class="btn btn-outline-secondary" id="exitEditModeBtn">
                            <i class="fas fa-times me-2"></i>Exit Edit Mode
                        </button>
                    </div>
                </div>

                @if($faculty->count() > 0)
                    <!-- Faculty Table -->
                    <div class="card">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="border-0 px-4 py-3">Faculty ID</th>
                                            <th class="border-0 px-4 py-3">First Name</th>
                                                                                         <th class="border-0 px-4 py-3">Last Name</th>
                                             <th class="border-0 px-4 py-3">Gender</th>
                                             <th class="border-0 px-4 py-3">Date of Birth</th>
                                             <th class="border-0 px-4 py-3">Department</th>
                                            <th class="border-0 px-4 py-3">Email</th>
                                                                                         <th class="border-0 px-4 py-3">Phone</th>
                                             <th class="border-0 px-4 py-3">Hire Date</th>
                                            <th class="border-0 px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($faculty as $member)
                                            <tr class="border-bottom" data-faculty-id="{{ $member->faculty_id }}">
                                                <td class="px-4 py-3">
                                                    <strong>{{ $member->faculty_id ?? 'N/A' }}</strong>
                                                </td>
                                                <td class="px-4 py-3" data-field="first_name" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text">{{ $member->first_name }}</span>
                                                    <input type="text" class="form-control form-control-sm d-none editable-input" data-field="first_name" value="{{ $member->first_name }}">
                                                </td>
                                                <td class="px-4 py-3" data-field="last_name" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text">{{ $member->last_name }}</span>
                                                    <input type="text" class="form-control form-control-sm d-none editable-input" data-field="last_name" value="{{ $member->last_name }}">
                                                </td>
                                                <td class="px-4 py-3" data-field="gender" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text badge bg-secondary">{{ $member->gender ?? 'N/A' }}</span>
                                                    <select class="form-select form-select-sm d-none editable-input" data-field="gender">
                                                        <option value="">Select Gender</option>
                                                        <option value="Male" {{ $member->gender == 'Male' ? 'selected' : '' }}>Male</option>
                                                        <option value="Female" {{ $member->gender == 'Female' ? 'selected' : '' }}>Female</option>
                                                        <option value="Other" {{ $member->gender == 'Other' ? 'selected' : '' }}>Other</option>
                                                    </select>
                                                </td>
                                                <td class="px-4 py-3" data-field="date_of_birth" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text">{{ $member->date_of_birth ? \Carbon\Carbon::parse($member->date_of_birth)->format('M d, Y') : 'N/A' }}</span>
                                                    <input type="date" class="form-control form-control-sm d-none editable-input" data-field="date_of_birth" value="{{ $member->date_of_birth ? \Carbon\Carbon::parse($member->date_of_birth)->format('Y-m-d') : '' }}">
                                                </td>
                                                 <td class="px-4 py-3" data-field="department_id" data-faculty-id="{{ $member->faculty_id }}">
                                                    @if($member->department)
                                                        <span class="editable-text badge bg-primary">{{ $member->department->department_name }}</span>
                                                        <select class="form-select form-select-sm d-none editable-input" data-field="department_id">
                                                            <option value="">Select Department</option>
                                                            @foreach($departments as $dept)
                                                                <option value="{{ $dept->department_id }}" {{ $member->department_id == $dept->department_id ? 'selected' : '' }}>
                                                                    {{ $dept->department_name }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    @else
                                                        <span class="editable-text text-muted">Not assigned</span>
                                                        <select class="form-select form-select-sm d-none editable-input" data-field="department_id">
                                                            <option value="">Select Department</option>
                                                            @foreach($departments as $dept)
                                                                <option value="{{ $dept->department_id }}">{{ $dept->department_name }}</option>
                                                            @endforeach
                                                        </select>
                                                    @endif
                                                </td>
                                                <td class="px-4 py-3" data-field="email" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text">{{ $member->email ?? 'N/A' }}</span>
                                                    <input type="email" class="form-control form-control-sm d-none editable-input" data-field="email" value="{{ $member->email ?? '' }}">
                                                </td>
                                                <td class="px-4 py-3" data-field="phone" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text">{{ $member->phone ?? 'N/A' }}</span>
                                                    <input type="tel" class="form-control form-control-sm d-none editable-input" data-field="phone" value="{{ $member->phone ?? '' }}">
                                                </td>
                                                <td class="px-4 py-3" data-field="hire_date" data-faculty-id="{{ $member->faculty_id }}">
                                                    <span class="editable-text">{{ $member->hire_date ? \Carbon\Carbon::parse($member->hire_date)->format('M d, Y') : 'N/A' }}</span>
                                                    <input type="date" class="form-control form-control-sm d-none editable-input" data-field="hire_date" value="{{ $member->hire_date ? \Carbon\Carbon::parse($member->hire_date)->format('Y-m-d') : '' }}">
                                                </td>
                                                <td class="px-4 py-3">
                                                    <!-- Edit Mode Buttons -->
                                                    <div class="btn-group" role="group">
                                                        <button class="btn btn-outline-primary btn-sm edit-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Edit">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                        <button class="btn btn-success btn-sm save-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Save">
                                                            <i class="fas fa-save"></i>
                                                        </button>
                                                        <button class="btn btn-danger btn-sm cancel-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Cancel">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                    
                                                    <!-- Archive Mode Buttons -->
                                                    <div class="btn-group" role="group">
                                                        <button class="btn btn-outline-warning btn-sm archive-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Archive Faculty">
                                                            <i class="fas fa-archive"></i>
                                                        </button>
                                                        <button class="btn btn-outline-secondary btn-sm cancel-archive-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Cancel Archive">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="d-flex justify-content-center mt-4">
                        {{ $faculty->links() }}
                    </div>
                @else
                    <div class="alert alert-info text-center">
                        <i class="fas fa-info-circle fa-2x mb-3"></i>
                        <h5>No Faculty Members Found</h5>
                        <p class="mb-0">There are currently no faculty members in the system.</p>
                    </div>
                @endif
            </div>
        </div>
    </main>

    <!-- Add Faculty Modal -->
    <div class="modal fade" id="addFacultyModal" tabindex="-1" aria-labelledby="addFacultyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addFacultyModalLabel">
                        <i class="fas fa-plus me-2"></i>Add New Faculty Member
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addFacultyForm">
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="first_name" class="form-label">First Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="first_name" name="first_name" required>
                            </div>
                                                         <div class="col-md-6 mb-3">
                                 <label for="last_name" class="form-label">Last Name <span class="text-danger">*</span></label>
                                 <input type="text" class="form-control" id="last_name" name="last_name" required>
                             </div>
                         </div>
                         <div class="row">
                             <div class="col-md-6 mb-3">
                                 <label for="gender" class="form-label">Gender</label>
                                 <select class="form-select" id="gender" name="gender">
                                     <option value="">Select Gender</option>
                                     <option value="Male">Male</option>
                                     <option value="Female">Female</option>
                                     <option value="Other">Other</option>
                                 </select>
                             </div>
                             <div class="col-md-6 mb-3">
                                 <label for="date_of_birth" class="form-label">Date of Birth</label>
                                 <input type="date" class="form-control" id="date_of_birth" name="date_of_birth">
                             </div>
                         </div>
                         <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" name="email">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="phone" class="form-label">Phone</label>
                                <input type="tel" class="form-control" id="phone" name="phone">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="department_id" class="form-label">Department</label>
                                <select class="form-select" id="department_id" name="department_id">
                                    <option value="">Select Department</option>
                                    @foreach($departments as $dept)
                                        <option value="{{ $dept->department_id }}">{{ $dept->department_name }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="hire_date" class="form-label">Hire Date</label>
                                <input type="date" class="form-control" id="hire_date" name="hire_date">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-2"></i>Add Faculty Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Notification Container -->
    <div id="notificationContainer"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/sidebar.js') }}"></script>
    <script src="{{ asset('js/faculty.js') }}"></script>
</body>
</html>
