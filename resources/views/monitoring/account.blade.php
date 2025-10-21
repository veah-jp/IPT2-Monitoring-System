<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Management - Student and Faculty Management System</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
    
    <style>
        .account-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .account-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
        }
        
        .account-card.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .account-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .account-header h2 {
            margin: 0;
            font-size: 2rem;
            font-weight: 600;
        }
        
        .account-header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .account-body {
            padding: 30px;
        }
        
        .account-tabs {
            display: flex;
            border-bottom: 2px solid #f8f9fa;
            margin-bottom: 30px;
        }
        
        .account-tab-btn {
            background: none;
            border: none;
            padding: 15px 25px;
            font-size: 1rem;
            font-weight: 500;
            color: #6c757d;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
        }
        
        .account-tab-btn:hover {
            color: #667eea;
            background-color: #f8f9fa;
        }
        
        .account-tab-btn.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background-color: #f8f9fa;
        }
        
        .account-tab-content {
            display: none;
        }
        
        .account-tab-content.active {
            display: block;
        }
        
        .form-group {
            margin-bottom: 25px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
        }
        
        .form-group.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 8px;
            display: block;
        }
        
        .form-control {
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 12px 15px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .form-control.is-invalid {
            border-color: #dc3545;
        }
        
        .invalid-feedback {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 5px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            padding: 12px 30px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .btn-primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        
        .notification-error {
            background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
        }
        
        .notification-info {
            background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
        }
        
        .user-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 2rem;
        }
        
        .password-requirements {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .password-requirements h6 {
            color: #495057;
            margin-bottom: 15px;
        }
        
        .requirement-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .requirement-item i {
            margin-right: 8px;
            width: 16px;
        }
        
        .requirement-item.valid i {
            color: #28a745;
        }
        
        .requirement-item.invalid i {
            color: #dc3545;
        }
    </style>
</head>
<body>
         <!-- Sidebar -->
     <aside id="sidebar" class="sidebar">
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
                <li>
                    <a href="{{ route('settings') }}">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
                <li class="active">
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
                <h1>Account Management</h1>
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

        <div class="account-container">
            <!-- User Data (hidden) -->
            <div id="currentUserData" style="display: none;">
                {
                    "user_id": "{{ Auth::user()->user_id }}",
                    "username": "{{ Auth::user()->username }}",
                    "first_name": "{{ Auth::user()->first_name }}",
                    "last_name": "{{ Auth::user()->last_name }}",
                    "email": "{{ Auth::user()->email }}"
                }
            </div>

            <!-- Account Header Card -->
            <div class="account-card">
                <div class="account-header">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h2>{{ Auth::user()->first_name && Auth::user()->last_name ? Auth::user()->first_name . ' ' . Auth::user()->last_name : Auth::user()->username }}</h2>
                    <p>{{ Auth::user()->email ?: 'No email provided' }}</p>
                </div>
            </div>

            <!-- Account Management Card -->
            <div class="account-card">
                <div class="account-body">
                    <!-- Tab Navigation -->
                    <div class="account-tabs">
                        <button class="account-tab-btn active" data-tab="profile">
                            <i class="fas fa-user me-2"></i>Profile
                        </button>
                        <button class="account-tab-btn" data-tab="password">
                            <i class="fas fa-key me-2"></i>Password
                        </button>
                    </div>

                    <!-- Profile Tab -->
                    <div id="profileTab" class="account-tab-content active">
                        <form id="profileForm">
                            <div class="row">
                                <div class="col-md-6">
                                                                         <div class="form-group">
                                         <label for="username" class="form-label">Username</label>
                                         <input type="text" class="form-control" id="username" name="username" value="{{ Auth::user()->username }}" placeholder="Enter your username">
                                     </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="email" name="email" value="{{ Auth::user()->email }}" placeholder="Enter your email address">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="first_name" class="form-label">First Name</label>
                                        <input type="text" class="form-control" id="first_name" name="first_name" value="{{ Auth::user()->first_name }}" placeholder="Enter your first name">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="last_name" class="form-label">Last Name</label>
                                        <input type="text" class="form-control" id="last_name" name="last_name" value="{{ Auth::user()->last_name }}" placeholder="Enter your last name">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary" data-original-text="Update Profile">
                                    <i class="fas fa-save me-2"></i>Update Profile
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Password Tab -->
                    <div id="passwordTab" class="account-tab-content">
                        <form id="changePasswordForm">
                            <div class="form-group">
                                <label for="current_password" class="form-label">Current Password</label>
                                <input type="password" class="form-control" id="current_password" name="current_password" placeholder="Enter your current password">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="new_password" class="form-label">New Password</label>
                                        <input type="password" class="form-control" id="new_password" name="new_password" placeholder="Enter your new password">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="confirm_password" class="form-label">Confirm New Password</label>
                                        <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm your new password">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary" data-original-text="Change Password">
                                    <i class="fas fa-key me-2"></i>Change Password
                                </button>
                            </div>
                        </form>

                        <!-- Password Requirements -->
                        <div class="password-requirements">
                            <h6><i class="fas fa-info-circle me-2"></i>Password Requirements</h6>
                            <div class="requirement-item">
                                <i class="fas fa-check-circle"></i>
                                <span>At least 6 characters long</span>
                            </div>
                            <div class="requirement-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Current password must be correct</span>
                            </div>
                            <div class="requirement-item">
                                <i class="fas fa-check-circle"></i>
                                <span>New passwords must match</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="{{ asset('js/sidebar.js') }}"></script>
    <script src="{{ asset('js/account.js') }}"></script>
</body>
</html>
