<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Students - Student and Faculty Management System</title>
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
                <li class="active">
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
                <h1>Students</h1>
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
                        <i class="fas fa-home me-3 text-primary" style="font-size: 1.5rem;"></i>
                        <h2 class="mb-0">Students</h2>
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
                            <input type="text" class="form-control border-start-0" placeholder="Search Students" id="studentSearch">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="departmentFilter">
                            <option value="">Filter by Department</option>
                        </select>
                    </div>
                    <div class="col-md-3" id="courseFilterContainer" style="display: none;">
                        <select class="form-select" id="courseFilter">
                            <option value="">Filter by Course</option>
                        </select>
                    </div>
                </div>

                                                                   <!-- Action Buttons -->
                  <div class="row mb-4">
                      <div class="col-12">
                          <div class="btn-group" role="group">
                              <button type="button" class="btn btn-outline-primary" id="addStudentsBtn">
                                  <i class="fas fa-plus me-2"></i>Add Students
                              </button>
                              <button type="button" class="btn btn-outline-secondary" id="editSelectedBtn">
                                  <i class="fas fa-user-edit me-2"></i>Edit Student
                              </button>
                              <button type="button" class="btn btn-outline-info" id="archiveStudentsBtn">
                                  <i class="fas fa-archive me-2"></i>Archive Students
                              </button>
                          </div>
                      </div>
                  </div>

                <!-- Add Student Modal -->
                <div class="modal fade" id="addStudentModal" tabindex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title" id="addStudentModalLabel">
                                    <i class="fas fa-user-plus me-2"></i>Add New Student
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body p-4">
                                                                 <div class="text-center mb-4">
                                     <p class="text-muted mb-0">Fill out this form to add a new student to the system! Student ID will be automatically generated.</p>
                                 </div>
                                
                                <form id="addStudentForm">
                                    @csrf
                                    
                                                                                                              <!-- Personal Information Section -->
                                     <div class="mb-4">
                                         <h6 class="text-primary border-bottom pb-2 mb-3">
                                             <i class="fas fa-user me-2"></i>Personal Information
                                         </h6>
                                         
                                         <div class="row g-3">
                                             <div class="col-md-6">
                                                 <label for="first_name" class="form-label fw-bold">First Name *</label>
                                                 <input type="text" class="form-control form-control-lg" id="first_name" name="first_name" placeholder="Enter First Name" required>
                                             </div>
                                             <div class="col-md-6">
                                                 <label for="last_name" class="form-label fw-bold">Last Name *</label>
                                                 <input type="text" class="form-control form-control-lg" id="last_name" name="last_name" placeholder="Enter Last Name" required>
                                             </div>
                                            <div class="col-md-6">
                                                <label for="gender" class="form-label fw-bold">Gender *</label>
                                                <select class="form-select form-select-lg" id="gender" name="gender" required>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="date_of_birth" class="form-label fw-bold">Date of Birth *</label>
                                                <input type="date" class="form-control form-control-lg" id="date_of_birth" name="date_of_birth" required>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="year" class="form-label fw-bold">Year Level *</label>
                                                <select class="form-select form-select-lg" id="year" name="year" required>
                                                    <option value="">Select Year Level</option>
                                                    <option value="1st Year">1st Year</option>
                                                    <option value="2nd Year">2nd Year</option>
                                                    <option value="3rd Year">3rd Year</option>
                                                    <option value="4th Year">4th Year</option>
                                                </select>
                                            </div>
                                            <div class="col-12">
                                                <label for="address" class="form-label fw-bold">Address *</label>
                                                <textarea class="form-control" id="address" name="address" rows="3" placeholder="Enter complete address" required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Academic Information Section -->
                                    <div class="mb-4">
                                        <h6 class="text-primary border-bottom pb-2 mb-3">
                                            <i class="fas fa-graduation-cap me-2"></i>Academic Information
                                        </h6>
                                        
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label for="department_id" class="form-label fw-bold">Department *</label>
                                                <select class="form-select form-select-lg" id="department_id" name="department_id" required>
                                                    <option value="">Select Department</option>
                                                    <option value="1">CSP</option>
                                                    <option value="2">Engineering</option>
                                                    <option value="3">BAP</option>
                                                    <option value="4">ASP</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="course_id" class="form-label fw-bold">Course *</label>
                                                <select class="form-select form-select-lg" id="course_id" name="course_id" required disabled>
                                                    <option value="">Select Department First</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer bg-light">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                    <i class="fas fa-times me-2"></i>Cancel
                                </button>
                                <button type="button" class="btn btn-outline-warning" id="clearForm">
                                    <i class="fas fa-eraser me-2"></i>Clear Form
                                </button>
                                <button type="submit" form="addStudentForm" class="btn btn-primary btn-lg">
                                    <i class="fas fa-save me-2"></i>Add Student
                                </button>
                            </div>
                        </div>
                    </div>
                                 </div>
 
                 <!-- Edit Student Modal -->
                 <div class="modal fade" id="editStudentModal" tabindex="-1" aria-labelledby="editStudentModalLabel" aria-describedby="editStudentModalDescription">
                     <div class="modal-dialog modal-lg">
                         <div class="modal-content">
                             <div class="modal-header bg-warning text-white">
                                 <h5 class="modal-title" id="editStudentModalLabel">
                                     <i class="fas fa-user-edit me-2"></i>Edit Student
                                 </h5>
                                 <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                             </div>
                             <div class="modal-body p-4">
                                                                   <div class="text-center mb-4" id="editStudentModalDescription">
                                      <p class="text-muted mb-0">Update the student information below. All fields including Student ID can be modified.</p>
                                  </div>
                                 
                                 <form id="editStudentForm">
                                     @csrf
                                     @method('PUT')
                                     
                                     <!-- Student ID (Read-only) -->
                                     <div class="mb-4">
                                         <h6 class="text-warning border-bottom pb-2 mb-3">
                                             <i class="fas fa-id-card me-2"></i>Student Information
                                         </h6>
                                         <div class="row g-3">
                                                                                <div class="col-md-6">
                                       <label for="edit_student_id" class="form-label fw-bold">Student ID *</label>
                                       <input type="text" class="form-control form-control-lg" id="edit_student_id" name="edit_student_id" placeholder="Enter Student ID" required>
                                       <small class="text-muted">You can modify the student ID if needed</small>
                                   </div>
                                         </div>
                                     </div>
                                     
                                     <!-- Personal Information Section -->
                                     <div class="mb-4">
                                         <h6 class="text-primary border-bottom pb-2 mb-3">
                                             <i class="fas fa-user me-2"></i>Personal Information
                                         </h6>
                                         
                                         <div class="row g-3">
                                                                                           <div class="col-md-6">
                                                  <label for="edit_first_name" class="form-label fw-bold">First Name *</label>
                                                  <input type="text" class="form-control form-control-lg" id="edit_first_name" name="edit_first_name" placeholder="Enter First Name" required>
                                              </div>
                                              <div class="col-md-6">
                                                  <label for="edit_last_name" class="form-label fw-bold">Last Name *</label>
                                                  <input type="text" class="form-control form-control-lg" id="edit_last_name" name="edit_last_name" placeholder="Enter Last Name" required>
                                              </div>
                                             <div class="col-md-6">
                                                 <label for="edit_gender" class="form-label fw-bold">Gender *</label>
                                                 <select class="form-select form-select-lg" id="edit_gender" name="edit_gender" required>
                                                     <option value="">Select Gender</option>
                                                     <option value="Male">Male</option>
                                                     <option value="Female">Female</option>
                                                     <option value="Other">Other</option>
                                                 </select>
                                             </div>
                                             <div class="col-md-6">
                                                 <label for="edit_date_of_birth" class="form-label fw-bold">Date of Birth *</label>
                                                 <input type="date" class="form-control form-control-lg" id="edit_date_of_birth" name="edit_date_of_birth" required>
                                             </div>
                                             <div class="col-md-6">
                                                 <label for="edit_year" class="form-label fw-bold">Year Level *</label>
                                                 <select class="form-select form-select-lg" id="edit_year" name="edit_year" required>
                                                     <option value="">Select Year Level</option>
                                                     <option value="1st Year">1st Year</option>
                                                     <option value="2nd Year">2nd Year</option>
                                                     <option value="3rd Year">3rd Year</option>
                                                     <option value="4th Year">4th Year</option>
                                                 </select>
                                             </div>
                                             <div class="col-12">
                                                 <label for="edit_address" class="form-label fw-bold">Address *</label>
                                                 <textarea class="form-control" id="edit_address" name="edit_address" rows="3" placeholder="Enter complete address" required></textarea>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     <!-- Academic Information Section -->
                                     <div class="mb-4">
                                         <h6 class="text-primary border-bottom pb-2 mb-3">
                                             <i class="fas fa-graduation-cap me-2"></i>Academic Information
                                         </h6>
                                         
                                         <div class="row g-3">
                                             <div class="col-md-6">
                                                 <label for="edit_department_id" class="form-label fw-bold">Department *</label>
                                                 <select class="form-select form-select-lg" id="edit_department_id" name="edit_department_id" required>
                                                     <option value="">Select Department</option>
                                                     <option value="1">CSP</option>
                                                     <option value="2">Engineering</option>
                                                     <option value="3">BAP</option>
                                                     <option value="4">ASP</option>
                                                 </select>
                                             </div>
                                             <div class="col-md-6">
                                                 <label for="edit_course_id" class="form-label fw-bold">Course *</label>
                                                 <select class="form-select form-select-lg" id="edit_course_id" name="edit_course_id" required disabled>
                                                     <option value="">Select Department First</option>
                                                 </select>
                                             </div>
                                         </div>
                                     </div>
                                 </form>
                             </div>
                             <div class="modal-footer bg-light">
                                 <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                     <i class="fas fa-times me-2"></i>Cancel
                                 </button>
                                 <button type="button" class="btn btn-outline-warning" id="clearEditForm">
                                     <i class="fas fa-eraser me-2"></i>Clear Changes
                                 </button>
                                 <button type="submit" form="editStudentForm" class="btn btn-warning btn-lg">
                                     <i class="fas fa-save me-2"></i>Update Student
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
 
                 <!-- Students Table -->
                <div class="card">
                    <div class="card-body p-0">
                        @if($students->count() > 0)
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                                                                                                   <thead class="table-light">
                                          <tr>
                                              <th class="border-0 px-4 py-3">Students ID</th>
                                              <th class="border-0 px-4 py-3">First Name</th>
                                              <th class="border-0 px-4 py-3">Last Name</th>
                                              <th class="border-0 px-4 py-3">Course</th>
                                              <th class="border-0 px-4 py-3">Department</th>
                                              <th class="border-0 px-4 py-3">Gender</th>
                                              <th class="border-0 px-4 py-3">Date of Birth</th>
                                                                                             <th class="border-0 px-4 py-3">Address</th>
                                               <th class="border-0 px-4 py-3">Year</th>
                                               <th class="border-0 px-4 py-3">Actions</th>
                                           </tr>
                                      </thead>
                                    <tbody>
                                                                                 @foreach($students as $student)
                                                                                           <tr class="border-bottom">
                                                                                                                                                                                                             <td class="px-4 py-3">
                                                      <strong>{{ $student->student_id ?? 'N/A' }}</strong>
                                                  </td>
                                                                                                     <td class="px-4 py-3" data-field="first_name" data-student-id="{{ $student->student_id }}">
                                                            <span class="editable-text">{{ $student->first_name }}</span>
                                                            <input type="text" class="form-control form-control-sm d-none editable-input" value="{{ $student->first_name }}">
                                                   </td>
                                                                                                     <td class="px-4 py-3" data-field="last_name" data-student-id="{{ $student->student_id }}">
                                                            <span class="editable-text">{{ $student->last_name }}</span>
                                                            <input type="text" class="form-control form-control-sm d-none editable-input" value="{{ $student->last_name }}">
                                                   </td>
                                                                                                       <td class="px-4 py-3" data-field="course_id" data-student-id="{{ $student->student_id }}">
                                                     @if($student->course)
                                                         <span class="editable-text badge bg-success">{{ $student->course->course_name }}</span>
                                                         <select class="form-select form-select-sm d-none editable-input">
                                                             <option value="">Select Course</option>
                                                             <option value="1" {{ $student->course_id == 1 ? 'selected' : '' }}>BSIT</option>
                                                             <option value="2" {{ $student->course_id == 2 ? 'selected' : '' }}>BSCE</option>
                                                             <option value="3" {{ $student->course_id == 3 ? 'selected' : '' }}>BSSS</option>
                                                         </select>
                                                     @else
                                                         <span class="editable-text text-muted">Not assigned</span>
                                                         <select class="form-select form-select-sm d-none editable-input">
                                                             <option value="">Select Course</option>
                                                             <option value="1">BSIT</option>
                                                             <option value="2">BSCE</option>
                                                             <option value="3">BSSS</option>
                                                         </select>
                                                     @endif
                                                 </td>
                                                 <td class="px-4 py-3" data-field="department_id" data-student-id="{{ $student->student_id }}">
                                                     @if($student->course && $student->course->department)
                                                         <span class="editable-text badge bg-primary">{{ $student->course->department->department_name }}</span>
                                                         <select class="form-select form-select-sm d-none editable-input">
                                                             <option value="">Select Department</option>
                                                             <option value="1" {{ $student->course && $student->course->department_id == 1 ? 'selected' : '' }}>CSP</option>
                                                             <option value="2" {{ $student->course && $student->course->department_id == 2 ? 'selected' : '' }}>Engineering</option>
                                                             <option value="3" {{ $student->course && $student->course->department_id == 3 ? 'selected' : '' }}>BAP</option>
                                                             <option value="4" {{ $student->course && $student->course->department_id == 4 ? 'selected' : '' }}>ASP</option>
                                                         </select>
                                                     @else
                                                         <span class="editable-text text-muted">Not assigned</span>
                                                         <select class="form-select form-select-sm d-none editable-input">
                                                             <option value="">Select Department</option>
                                                             <option value="1">CSP</option>
                                                             <option value="2">Engineering</option>
                                                             <option value="3">BAP</option>
                                                             <option value="4">ASP</option>
                                                         </select>
                                                     @endif
                                                 </td>
                                                 <td class="px-4 py-3" data-field="gender" data-student-id="{{ $student->student_id }}">
                                                     <span class="editable-text badge bg-secondary">{{ $student->gender ?? 'N/A' }}</span>
                                                     <select class="form-select form-select-sm d-none editable-input">
                                                         <option value="">Select Gender</option>
                                                         <option value="Male" {{ $student->gender == 'Male' ? 'selected' : '' }}>Male</option>
                                                         <option value="Female" {{ $student->gender == 'Female' ? 'selected' : '' }}>Female</option>
                                                         <option value="Other" {{ $student->gender == 'Other' ? 'selected' : '' }}>Other</option>
                                                     </select>
                                                 </td>
                                                 <td class="px-4 py-3" data-field="date_of_birth" data-student-id="{{ $student->student_id }}">
                                                     <span class="editable-text">{{ $student->date_of_birth ? \Carbon\Carbon::parse($student->date_of_birth)->format('M d, Y') : 'N/A' }}</span>
                                                     <input type="date" class="form-control form-control-sm d-none editable-input" value="{{ $student->date_of_birth ? \Carbon\Carbon::parse($student->date_of_birth)->format('Y-m-d') : '' }}">
                                                 </td>
                                                 <td class="px-4 py-3" data-field="address" data-student-id="{{ $student->student_id }}">
                                                     <span class="editable-text text-truncate d-inline-block" style="max-width: 150px;" title="{{ $student->address ?? 'N/A' }}">
                                                         {{ $student->address ?? 'N/A' }}
                                                     </span>
                                                     <textarea class="form-control form-control-sm d-none editable-input" rows="2" style="max-width: 150px;">{{ $student->address ?? '' }}</textarea>
                                                 </td>
                                                                                                                                                                                                       <td class="px-4 py-3" data-field="year" data-student-id="{{ $student->student_id }}">
                                                     <span class="editable-text badge bg-info">{{ $student->year ?? 'N/A' }}</span>
                                                     <select class="form-select form-select-sm d-none editable-input">
                                                         <option value="">Select Year</option>
                                                         <option value="1st Year" {{ $student->year == '1st Year' ? 'selected' : '' }}>1st Year</option>
                                                         <option value="2nd Year" {{ $student->year == '2nd Year' ? 'selected' : '' }}>2nd Year</option>
                                                         <option value="3rd Year" {{ $student->year == '3rd Year' ? 'selected' : '' }}>3rd Year</option>
                                                         <option value="4th Year" {{ $student->year == '4th Year' ? 'selected' : '' }}>4th Year</option>
                                                     </select>
                                                 </td>
                                                 <td class="px-4 py-3">
                                                     <!-- Edit Mode Buttons -->
                                                     <button type="button" class="btn btn-sm btn-outline-primary edit-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                         <i class="fas fa-edit"></i>
                                                     </button>
                                                     <button type="button" class="btn btn-sm btn-success save-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                         <i class="fas fa-save"></i>
                                                     </button>
                                                     <button type="button" class="btn btn-sm btn-secondary cancel-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                         <i class="fas fa-times"></i>
                                                     </button>
                                                     
                                                                                                           <!-- Archive Mode Buttons -->
                                                      <button type="button" class="btn btn-sm btn-warning archive-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                          <i class="fas fa-archive"></i>
                                                      </button>
                                                      <button type="button" class="btn btn-sm btn-secondary cancel-archive-btn d-none" data-student-id="{{ $student->student_id }}">
                                                          <i class="fas fa-times"></i>
                                                      </button>
                                                 </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        @else
                            <div class="text-center py-5">
                                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                                <h5 class="text-muted">No students found in the system.</h5>
                                <p class="text-muted">Start by adding some students to get started.</p>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Pagination -->
                @if($students->count() > 0)
                    <div class="d-flex justify-content-center mt-4">
                        {{ $students->links() }}
                    </div>
                @endif
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/sidebar.js') }}"></script>
    <script src="{{ asset('js/students.js') }}"></script>
</body>
</html>
