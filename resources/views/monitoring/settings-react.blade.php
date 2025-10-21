<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Settings (React) - Student and Faculty Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <style>
        .hide-legacy-modal { display: none !important; }
    </style>
</head>
<body>
    <div id="react-layout-root"></div>

    <div id="settings-content-wrapper" style="display: none;">
        @php
            // Render the legacy Blade view content inside this wrapper for React to mount/move
            echo view('monitoring.settings', ['departments' => $departments ?? collect()])->render();
        @endphp
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/react-settings.js') }}"></script>
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


