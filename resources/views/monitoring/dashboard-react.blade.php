<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Student and Faculty Management System</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/png" href="{{ asset('Father_Saturnino_Urios_University_logo.png') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
        }
        .dropdown-toggle::after {
            display: none;
        }
    </style>
</head>
<body>
    <div id="react-dashboard-container"></div>

    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <script src="{{ asset('js/react-dashboard.js') }}"></script>
    <style>

        
        .dropdown-menu::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60%;
            background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, transparent 100%);
            border-radius: 20px 20px 0 0;
            pointer-events: none;
            z-index: 1;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
        }
        
        .dropdown-menu::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(0deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%);
            border-radius: 0 0 20px 20px;
            pointer-events: none;
            z-index: 1;
        }
        
        .dropdown-menu {
            position: relative;
        }
        

        
        .dropdown-item {
            position: relative;
            z-index: 2;
            margin-bottom: 4px;
        }
        
        .dropdown-item:hover {
            background: rgba(59, 130, 246, 0.1) !important;
        }
        
        .dropdown-item:hover .fw-semibold {
            color: #3b82f6 !important;
        }
        
        .dropdown-item:hover small {
            color: #6b7280 !important;
        }
    </style>
    <script>
        window.mountDashboard && window.mountDashboard();
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

