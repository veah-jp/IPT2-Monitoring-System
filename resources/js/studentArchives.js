class StudentArchives {
    constructor() {
        this.init();
    }

    init() {
        console.log('StudentArchives: Initializing...');
        this.bindEvents();
        this.loadInitialData();
        console.log('StudentArchives: Initialized successfully');
    }

    bindEvents() {
        // Search functionality
        const studentArchiveSearch = document.getElementById('studentArchiveSearch');
        if (studentArchiveSearch) {
            studentArchiveSearch.addEventListener('input', (e) => this.filterStudentArchives(e.target.value));
        }

        // Clear filters button
        const clearStudentArchiveFilters = document.getElementById('clearStudentArchiveFilters');
        if (clearStudentArchiveFilters) {
            clearStudentArchiveFilters.addEventListener('click', () => this.clearFilters());
        }
    }

    loadInitialData() {
        this.loadStudentArchives();
    }

    // Student Archives Methods
    loadStudentArchives() {
        console.log('StudentArchives: Loading student archives...');
        this.showStudentArchivesLoading();
        
        fetch('/api/archived-students')
            .then(response => response.json())
            .then(response => {
                console.log('StudentArchives: Student archives response:', response);
                this.hideStudentArchivesLoading();
                const data = response.data || response;
                console.log('StudentArchives: Student archives data:', data);
                if (data && data.length > 0) {
                    this.populateStudentArchivesTable(data);
                    document.getElementById('studentArchivesTable').style.display = 'table';
                    document.getElementById('noStudentArchives').style.display = 'none';
                } else {
                    document.getElementById('studentArchivesTable').style.display = 'none';
                    document.getElementById('noStudentArchives').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error loading student archives:', error);
                this.hideStudentArchivesLoading();
            });
    }

    // Loading state methods
    showStudentArchivesLoading() {
        const loading = document.getElementById('studentArchivesLoading');
        if (loading) loading.style.display = 'block';
    }

    hideStudentArchivesLoading() {
        const loading = document.getElementById('studentArchivesLoading');
        if (loading) loading.style.display = 'none';
    }

    // Table population methods
    populateStudentArchivesTable(students) {
        const tbody = document.querySelector('#studentArchivesTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.student_id || ''}</td>
                <td>${student.first_name || ''} ${student.last_name || ''}</td>
                <td>${student.course || ''}</td>
                <td>${student.department || ''}</td>
                <td>${student.gender || ''}</td>
                <td>${student.date_of_birth || ''}</td>
                <td>${student.address || ''}</td>
                <td>${student.year || ''}</td>
                <td>
                    <button class="btn btn-sm btn-success restore-student-btn" data-student-id="${student.student_id}">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindStudentArchiveActions();
    }

    // Action binding methods
    bindStudentArchiveActions() {
        document.querySelectorAll('.restore-student-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const studentId = e.currentTarget.dataset.studentId;
                this.restoreStudent(studentId);
            });
        });
    }

    // Restore methods
    restoreStudent(studentId) {
        if (confirm('Are you sure you want to restore this student?')) {
            fetch(`/api/restore-student/${studentId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Student restored successfully!');
                    this.loadStudentArchives();
                } else {
                    alert('Error restoring student: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error restoring student');
            });
        }
    }

    // Filter methods
    filterStudentArchives(searchTerm) {
        const rows = document.querySelectorAll('#studentArchivesTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    // Clear filters
    clearFilters() {
        const searchInput = document.getElementById('studentArchiveSearch');
        if (searchInput) {
            searchInput.value = '';
            this.filterStudentArchives('');
        }
    }
}

// Module will be initialized by SettingsPage when content is shown
