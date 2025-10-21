class FacultyArchives {
    constructor() {
        this.init();
    }

    init() {
        console.log('FacultyArchives: Initializing...');
        this.bindEvents();
        this.loadInitialData();
        console.log('FacultyArchives: Initialized successfully');
    }

    bindEvents() {
        // Search functionality
        const facultyArchiveSearch = document.getElementById('facultyArchiveSearch');
        if (facultyArchiveSearch) {
            facultyArchiveSearch.addEventListener('input', (e) => this.filterFacultyArchives(e.target.value));
        }
    }

    loadInitialData() {
        this.loadFacultyArchives();
    }

    // Faculty Archives Methods
    loadFacultyArchives() {
        this.showFacultyArchivesLoading();
        
        fetch('/api/archived-faculty')
            .then(response => response.json())
            .then(response => {
                this.hideFacultyArchivesLoading();
                const data = response.data || response;
                if (data && data.length > 0) {
                    this.populateFacultyArchivesTable(data);
                    document.getElementById('facultyArchivesTable').style.display = 'table';
                    document.getElementById('noFacultyArchives').style.display = 'none';
                } else {
                    document.getElementById('facultyArchivesTable').style.display = 'none';
                    document.getElementById('noFacultyArchives').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error loading faculty archives:', error);
                this.hideFacultyArchivesLoading();
            });
    }

    // Loading state methods
    showFacultyArchivesLoading() {
        const loading = document.getElementById('facultyArchivesLoading');
        if (loading) loading.style.display = 'block';
    }

    hideFacultyArchivesLoading() {
        const loading = document.getElementById('facultyArchivesLoading');
        if (loading) loading.style.display = 'none';
    }

    // Table population methods
    populateFacultyArchivesTable(faculty) {
        const tbody = document.querySelector('#facultyArchivesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        faculty.forEach(facultyMember => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${facultyMember.faculty_id || ''}</td>
                <td>${facultyMember.first_name || ''} ${facultyMember.last_name || ''}</td>
                <td>${facultyMember.department || ''}</td>
                <td>${facultyMember.email || ''}</td>
                <td>${facultyMember.phone || ''}</td>
                <td>${facultyMember.gender || ''}</td>
                <td>${facultyMember.date_of_birth || ''}</td>
                <td>${facultyMember.hire_date || ''}</td>
                <td>
                    <button class="btn btn-sm btn-success restore-faculty-btn" data-faculty-id="${facultyMember.faculty_id}">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindFacultyArchiveActions();
    }

    // Action binding methods
    bindFacultyArchiveActions() {
        document.querySelectorAll('.restore-faculty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const facultyId = e.currentTarget.dataset.facultyId;
                this.restoreFaculty(facultyId);
            });
        });
    }

    // Restore methods
    restoreFaculty(facultyId) {
        if (confirm('Are you sure you want to restore this faculty member?')) {
            fetch(`/api/restore-faculty/${facultyId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Faculty member restored successfully!');
                    this.loadFacultyArchives();
                } else {
                    alert('Error restoring faculty member: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error restoring faculty member');
            });
        }
    }

    // Filter methods
    filterFacultyArchives(searchTerm) {
        const rows = document.querySelectorAll('#facultyArchivesTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }
}

// Module will be initialized by SettingsPage when content is shown
