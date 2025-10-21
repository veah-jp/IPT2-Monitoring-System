class DepartmentManagement {
    constructor() {
        this.init();
    }

    init() {
        console.log('DepartmentManagement: Initializing...');
        this.bindEvents();
        this.loadInitialData();
        console.log('DepartmentManagement: Initialized successfully');
    }

    bindEvents() {
        // Add Department Form
        const addDepartmentForm = document.getElementById('addDepartmentForm');
        if (addDepartmentForm) {
            addDepartmentForm.addEventListener('submit', (e) => this.handleAddDepartment(e));
        }

        // Search functionality
        const departmentSearch = document.getElementById('departmentSearch');
        if (departmentSearch) {
            departmentSearch.addEventListener('input', (e) => this.filterDepartments(e.target.value));
        }

        const departmentArchiveSearch = document.getElementById('departmentArchiveSearch');
        if (departmentArchiveSearch) {
            departmentArchiveSearch.addEventListener('input', (e) => this.filterDepartmentArchives(e.target.value));
        }
    }

    loadInitialData() {
        this.loadDepartmentsForEditing();
        this.loadDepartmentArchives();
    }

    // Department Management Methods
    loadDepartmentsForEditing() {
        fetch('/api/departments')
            .then(response => response.json())
            .then(data => {
                this.populateDepartmentsTable(data);
            })
            .catch(error => console.error('Error loading departments:', error));
    }

    loadDepartmentArchives() {
        fetch('/api/archived-departments')
            .then(response => response.json())
            .then(response => {
                const data = response.data || response;
                if (data && data.length > 0) {
                    this.populateDepartmentArchivesTable(data);
                    document.getElementById('departmentArchivesTable').style.display = 'table';
                    document.getElementById('noDepartmentArchives').style.display = 'none';
                } else {
                    document.getElementById('departmentArchivesTable').style.display = 'none';
                    document.getElementById('noDepartmentArchives').style.display = 'block';
                }
            })
            .catch(error => console.error('Error loading department archives:', error));
    }

    // Table population methods
    populateDepartmentsTable(departments) {
        const tbody = document.querySelector('#editDepartmentsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        departments.forEach(department => {
            const row = document.createElement('tr');
            // Store department data in data attributes for accurate editing
            row.setAttribute('data-department-code', department.department_code || '');
            row.setAttribute('data-department-name', department.department_name || '');
            row.setAttribute('data-description', department.description || '');
            
            row.innerHTML = `
                <td class="align-middle">
                    <span class="fw-bold text-primary">${department.department_code || ''}</span>
                </td>
                <td class="align-middle">
                    <span class="fw-semibold">${department.department_name || ''}</span>
                </td>
                <td class="align-middle">
                    <span class="text-muted">${department.description || 'No description'}</span>
                </td>
                <td class="align-middle">
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-warning edit-department-btn" data-department-id="${department.department_id}">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger archive-department-btn" data-department-id="${department.department_id}">
                            <i class="fas fa-archive me-1"></i>Archive
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindDepartmentActions();
    }

    populateDepartmentArchivesTable(departments) {
        const tbody = document.querySelector('#departmentArchivesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        departments.forEach(department => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="align-middle">
                    <span class="fw-bold text-primary">${department.department_code || ''}</span>
                </td>
                <td class="align-middle">
                    <span class="fw-semibold">${department.department_name || ''}</span>
                </td>
                <td class="align-middle">
                    <span class="text-muted">${department.description || 'No description'}</span>
                </td>
                <td class="align-middle">
                    <span class="badge bg-secondary">${department.archived_date || ''}</span>
                </td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-outline-success restore-department-btn" data-department-id="${department.department_id}">
                        <i class="fas fa-undo me-1"></i>Restore
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindDepartmentArchiveActions();
    }

    // Action binding methods
    bindDepartmentActions() {
        document.querySelectorAll('.edit-department-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const departmentId = e.currentTarget.dataset.departmentId;
                this.editDepartment(departmentId, e);
            });
        });

        document.querySelectorAll('.archive-department-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const departmentId = e.currentTarget.dataset.departmentId;
                this.archiveDepartment(departmentId);
            });
        });
    }

    bindDepartmentArchiveActions() {
        document.querySelectorAll('.restore-department-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const departmentId = e.currentTarget.dataset.departmentId;
                this.restoreDepartment(departmentId);
            });
        });
    }

    // Form handling methods
    handleAddDepartment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        fetch('/api/departments', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                department_code: formData.get('department_code'),
                department_name: formData.get('department_name'),
                description: formData.get('description')
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Department added successfully!');
                e.target.reset();
                this.loadDepartmentsForEditing();
                
                // Refresh student form data if available
                if (window.refreshStudentFormData) {
                    window.refreshStudentFormData();
                }
                
                // Refresh faculty form data if available
                if (window.refreshFacultyFormData) {
                    window.refreshFacultyFormData();
                }
            } else {
                alert('Error adding department: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding department');
        });
    }

    // Archive and restore methods
    archiveDepartment(departmentId) {
        if (confirm('Are you sure you want to archive this department?')) {
            fetch(`/api/departments/${departmentId}/archive`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Department archived successfully!');
                    this.loadDepartmentsForEditing();
                    this.loadDepartmentArchives();
                    // Trigger dashboard refresh if available
                    try { if (window.dashboard && window.dashboard.refreshDashboardData) { window.dashboard.refreshDashboardData(); } } catch (e) {}
                } else {
                    alert('Error archiving department: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error archiving department');
            });
        }
    }

    restoreDepartment(departmentId) {
        if (confirm('Are you sure you want to restore this department?')) {
            fetch(`/api/restore-department/${departmentId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Department restored successfully!');
                    this.loadDepartmentsForEditing();
                    this.loadDepartmentArchives();
                    // Trigger dashboard refresh if available
                    try { if (window.dashboard && window.dashboard.refreshDashboardData) { window.dashboard.refreshDashboardData(); } } catch (e) {}
                } else {
                    alert('Error restoring department: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error restoring department');
            });
        }
    }

    // Filter methods
    filterDepartments(searchTerm) {
        const rows = document.querySelectorAll('#editDepartmentsTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    filterDepartmentArchives(searchTerm) {
        const rows = document.querySelectorAll('#departmentArchivesTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    // Edit methods
    editDepartment(departmentId, event) {
        const row = event.currentTarget.closest('tr');
        if (!row) return;

        // Clear any existing highlighting
        this.clearAllHighlighting();

        // Add highlighting to the current row
        row.classList.add('table-warning');

        // Get current values from data attributes for accuracy
        const departmentCode = row.getAttribute('data-department-code');
        const departmentName = row.getAttribute('data-department-name');
        const description = row.getAttribute('data-description');
        
        // Debug logging
        console.log('Department data from row:', {
            departmentCode,
            departmentName,
            description
        });

        // Replace cells with input fields
        row.cells[0].innerHTML = `<input type="text" class="form-control form-control-sm border-primary" value="${departmentCode}" maxlength="20" placeholder="Department Code">`;
        row.cells[1].innerHTML = `<input type="text" class="form-control form-control-sm border-primary" value="${departmentName}" maxlength="255" placeholder="Department Name">`;
        row.cells[2].innerHTML = `<textarea class="form-control form-control-sm border-primary" rows="2" maxlength="500" placeholder="Description">${description}</textarea>`;
        
        // Replace action buttons with save/cancel
        row.cells[3].innerHTML = `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-success save-department-btn" data-department-id="${departmentId}">
                    <i class="fas fa-save me-1"></i>Save
                </button>
                <button class="btn btn-sm btn-outline-secondary cancel-department-btn" data-department-id="${departmentId}">
                    <i class="fas fa-times me-1"></i>Cancel
                </button>
            </div>
        `;

        // Bind save/cancel events
        this.bindEditActions(departmentId);
    }

    bindEditActions(departmentId) {
        // Find the row that contains the save/cancel buttons
        const row = document.querySelector(`.save-department-btn[data-department-id="${departmentId}"]`).closest('tr');
        
        // Save button
        const saveBtn = row.querySelector('.save-department-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => this.saveDepartmentEdit(departmentId, e));
        }

        // Cancel button
        const cancelBtn = row.querySelector('.cancel-department-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => this.cancelDepartmentEdit(departmentId, e));
        }
    }

    saveDepartmentEdit(departmentId, event) {
        const row = event.currentTarget.closest('tr');
        const departmentCode = row.cells[0].querySelector('input').value.trim();
        const departmentName = row.cells[1].querySelector('input').value.trim();
        const description = row.cells[2].querySelector('textarea').value.trim();

        // Validation
        if (!departmentCode || !departmentName) {
            alert('Department code and name are required!');
            return;
        }

        // Send update request
        fetch(`/api/departments/${departmentId}`, {
            method: 'PUT',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                department_code: departmentCode,
                department_name: departmentName,
                description: description
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Department updated successfully!');
                this.loadDepartmentsForEditing();
                
                // Refresh student form data if available
                if (window.refreshStudentFormData) {
                    window.refreshStudentFormData();
                }
                
                // Refresh faculty form data if available
                if (window.refreshFacultyFormData) {
                    window.refreshFacultyFormData();
                }
            } else {
                alert('Error updating department: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating department');
        });
    }

    cancelDepartmentEdit(departmentId, event) {
        this.clearAllHighlighting();
        this.loadDepartmentsForEditing();
    }

    clearAllHighlighting() {
        document.querySelectorAll('.table-warning').forEach(row => {
            row.classList.remove('table-warning');
        });
    }
}

// Module will be initialized by SettingsPage when content is shown
