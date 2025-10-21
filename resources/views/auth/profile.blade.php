<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Student and Faculty Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="{{ route('dashboard') }}">
                <i class="fas fa-graduation-cap"></i> Student and Faculty Management System
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
                <a class="nav-link" href="{{ route('students') }}">Students</a>
                <a class="nav-link" href="{{ route('courses') }}">Courses</a>
                <a class="nav-link" href="{{ route('departments') }}">Departments</a>
                <a class="nav-link" href="{{ route('enrollments') }}">Enrollments</a>
                <a class="nav-link active" href="{{ route('profile') }}">Profile</a>
                <form method="POST" action="{{ route('logout') }}" class="d-inline">
                    @csrf
                    <button type="submit" class="btn btn-link nav-link">Logout</button>
                </form>
            </div>
        </div>
    </nav>

    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-user-circle"></i> User Profile</h4>
                    </div>
                    <div class="card-body">
                        @if(session('success'))
                            <div class="alert alert-success">
                                {{ session('success') }}
                            </div>
                        @endif

                        <div class="row">
                            <div class="col-md-4 text-center">
                                <div class="mb-3">
                                    <i class="fas fa-user-circle fa-5x text-primary"></i>
                                </div>
                                <h5>{{ $user->username }}</h5>
                                <span class="badge bg-success">Administrator</span>
                            </div>
                            <div class="col-md-8">
                                <h6>Account Information</h6>
                                <table class="table table-borderless">
                                    <tr>
                                        <td><strong>Username:</strong></td>
                                        <td>{{ $user->username }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Role:</strong></td>
                                        <td>Administrator</td>
                                    </tr>
                                    <tr>
                                        <td><strong>User ID:</strong></td>
                                        <td>{{ $user->user_id }}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Created:</strong></td>
                                        <td>{{ $user->created_at ? $user->created_at->format('M d, Y') : 'N/A' }}</td>
                                    </tr>
                                </table>

                                <div class="mt-4">
                                    <a href="{{ route('change-password') }}" class="btn btn-warning me-2">
                                        <i class="fas fa-key"></i> Change Password
                                    </a>
                                    <a href="{{ route('dashboard') }}" class="btn btn-secondary">
                                        <i class="fas fa-arrow-left"></i> Back to Dashboard
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
