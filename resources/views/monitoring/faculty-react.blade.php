<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Faculty - Student and Faculty Management System</title>
    <link rel="icon" type="image/png" href="{{ asset('Father_Saturnino_Urios_University_logo.png') }}">
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
        
        /* Hide the old Blade add modal since we're using React modal */
        #addFacultyModal {
            display: none !important;
        }
    </style>
</head>
<body>
    <!-- React Layout will be mounted here -->
    <div id="react-layout-root"></div>

    <!-- Faculty Content (will be moved into React layout) -->
    <div id="faculty-content-wrapper" style="display: none;">
        @include('monitoring.partials.faculty-content')
        @include('monitoring.partials.faculty-modals')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/faculty.js') }}"></script>
    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
    <script src="{{ asset('js/react-faculty.js') }}"></script>
    <script>
        window.mountFaculty && window.mountFaculty();
    </script>
    <script>
        // Intercept React logout link (href="/logout") and perform POST with CSRF
        document.addEventListener('click', function(e) {
            var anchor = e.target && e.target.closest && e.target.closest('a[href="/logout"]');
            if (!anchor) return;
            e.preventDefault();
            var tokenMeta = document.querySelector('meta[name="csrf-token"]');
            var token = tokenMeta ? tokenMeta.getAttribute('content') : '';
            fetch('/logout', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token, 'Accept': 'text/html,application/json' },
                credentials: 'same-origin'
            }).finally(function() {
                window.location.href = '/login';
            });
        });
    </script>
</body>
</html>
