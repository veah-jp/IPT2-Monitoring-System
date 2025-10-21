<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Monitoring System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/login.css') }}" rel="stylesheet">
</head>
<body>
    <!-- Animated Background Elements -->
    <div class="bg-elements">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        <div class="floating-circle circle-3"></div>
    </div>

    <div class="login-container">
        <!-- Profile Icon -->
        <div class="profile-icon">
            <i class="fas fa-user"></i>
        </div>
        
        <!-- Login Card -->
        <div class="login-card">
            @if(session('error'))
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    {{ session('error') }}
                </div>
            @endif

            @if(session('success'))
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    {{ session('success') }}
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" id="loginForm">
                @csrf
                
                <div class="form-group">
                    <label for="username" class="form-label">Username</label>
                    <div class="input-container">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" 
                               class="form-control @error('username') is-invalid @enderror" 
                               id="username" 
                               name="username" 
                               value="{{ old('username') }}" 
                               placeholder="Enter your username"
                               required 
                               autofocus>
                    </div>
                    @error('username')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <div class="input-container">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" 
                               class="form-control @error('password') is-invalid @enderror" 
                               id="password" 
                               name="password" 
                               placeholder="Enter your password"
                               required>
                    </div>
                    @error('password')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="remember-me">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Remember me</label>
                </div>

                <button type="submit" class="btn-login" id="loginBtn">
                    LOGIN
                </button>
            </form>

            <div class="forgot-link">
                <a href="#">forgot Username/Password</a>
            </div>
        </div>

        <!-- Demo Accounts Info -->
        <div class="demo-accounts">
            <h6>Demo Accounts Available</h6>
            <div class="row text-center">
                <div class="col-4">
                    <small class="text-muted d-block">Admin</small>
                    <small class="text-primary">jerremaeadmin</small>
                </div>
                <div class="col-4">
                    <small class="text-muted d-block">Student</small>
                    <small class="text-success">john.doe</small>
                </div>
                <div class="col-4">
                    <small class="text-muted d-block">Faculty</small>
                    <small class="text-warning">robert.wilson</small>
                </div>
            </div>
            <div class="text-center mt-2">
                <small class="text-muted">Password: password123 / student123 / faculty123</small>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/login.js') }}"></script>
</body>
</html>
