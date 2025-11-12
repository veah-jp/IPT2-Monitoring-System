<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Reports - Student and Faculty Management System</title>
    <link rel="icon" type="image/png" href="{{ asset('Father_Saturnino_Urios_University_logo.png') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/dashboard.css') }}" rel="stylesheet">
</head>
<body>
    <!-- React Layout will be mounted here -->
    <div id="react-layout-root"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
    <script src="{{ asset('js/react-reports.js') }}"></script>
    <script>
        window.mountReports && window.mountReports();
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

