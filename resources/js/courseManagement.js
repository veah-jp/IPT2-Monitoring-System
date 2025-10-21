class CourseManagement {
    constructor() {
        this.init();
    }

    init() {
        console.log('CourseManagement: Initializing...');
        this.bindEvents();
        this.loadInitialData();
        console.log('CourseManagement: Initialized successfully');
    }

    bindEvents() {
        // Add Course Form
        const addCourseForm = document.getElementById('addCourseForm');
        if (addCourseForm) {
            addCourseForm.addEventListener('submit', (e) => this.handleAddCourse(e));
        }

        // Search functionality
        const courseSearch = document.getElementById('courseSearch');
        if (courseSearch) {
            courseSearch.addEventListener('input', (e) => this.filterCourses(e.target.value));
        }

        const courseArchiveSearch = document.getElementById('courseArchiveSearch');
        if (courseArchiveSearch) {
            courseArchiveSearch.addEventListener('input', (e) => this.filterCourseArchives(e.target.value));
        }
    }

    loadInitialData() {
        this.loadDepartmentsForCourseForm();
        this.loadCoursesForEditing();
        this.loadCourseArchives();
    }

    // Course Management Methods
    loadDepartmentsForCourseForm() {
        fetch('/api/departments')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('department_id');
                if (select) {
                    select.innerHTML = '<option value="">Select Department</option>';
                    data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.department_id;
                        option.textContent = dept.department_name;
                        select.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Error loading departments:', error));
    }

    loadCoursesForEditing() {
        fetch('/api/courses')
            .then(response => response.json())
            .then(data => {
                this.populateCoursesTable(data);
            })
            .catch(error => console.error('Error loading courses:', error));
    }

    loadCourseArchives() {
        fetch('/api/archived-courses')
            .then(response => response.json())
            .then(response => {
                const data = response.data || response;
                if (data && data.length > 0) {
                    this.populateCourseArchivesTable(data);
                    document.getElementById('courseArchivesTable').style.display = 'table';
                    document.getElementById('noCourseArchives').style.display = 'none';
                } else {
                    document.getElementById('courseArchivesTable').style.display = 'none';
                    document.getElementById('noCourseArchives').style.display = 'block';
                }
            })
            .catch(error => console.error('Error loading course archives:', error));
    }

    // Table population methods
    populateCoursesTable(courses) {
        const tbody = document.querySelector('#editCoursesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        courses.forEach(course => {
            const row = document.createElement('tr');
            // Store course data in data attributes for accurate editing
            row.setAttribute('data-course-code', course.course_code || '');
            row.setAttribute('data-course-name', course.course_name || '');
            row.setAttribute('data-department-name', course.department ? course.department.department_name : '');
            row.setAttribute('data-credits', course.credits || '');
            row.setAttribute('data-department-id', course.department ? course.department.department_id : '');
            
            row.innerHTML = `
                <td class="align-middle">
                    <span class="fw-bold text-primary">${course.course_code || ''}</span>
                </td>
                <td class="align-middle">
                    <span class="fw-semibold">${course.course_name || ''}</span>
                </td>
                <td class="align-middle">
                    <span class="text-muted">${course.department ? course.department.department_name : ''}</span>
                </td>
                <td class="align-middle">
                    <span class="fw-bold">${course.credits || ''}</span>
                </td>
                <td class="align-middle">
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-warning edit-course-btn" data-course-id="${course.course_id}">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger archive-course-btn" data-course-id="${course.course_id}">
                            <i class="fas fa-archive me-1"></i>Archive
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindCourseActions();
    }

    populateCourseArchivesTable(courses) {
        const tbody = document.querySelector('#courseArchivesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.course_code || ''}</td>
                <td>${course.course_name || ''}</td>
                <td>${course.department || ''}</td>
                <td>${course.credits || ''}</td>
                <td>${course.archived_date || ''}</td>
                <td>
                    <button class="btn btn-sm btn-success restore-course-btn" data-course-id="${course.course_id}">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.bindCourseArchiveActions();
    }

    // Action binding methods
    bindCourseActions() {
        document.querySelectorAll('.edit-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = e.currentTarget.dataset.courseId;
                this.editCourse(courseId, e);
            });
        });

        document.querySelectorAll('.archive-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = e.currentTarget.dataset.courseId;
                this.archiveCourse(courseId);
            });
        });
    }

    bindCourseArchiveActions() {
        document.querySelectorAll('.restore-course-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const courseId = e.currentTarget.dataset.courseId;
                this.restoreCourse(courseId);
            });
        });
    }

    // Form handling methods
    handleAddCourse(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        fetch('/api/courses', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                course_code: formData.get('course_code'),
                course_name: formData.get('course_name'),
                department_id: formData.get('department_id'),
                credits: formData.get('credits')
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Course added successfully!');
                e.target.reset();
                this.loadCoursesForEditing();
                
                // Refresh student form data if available
                if (window.refreshStudentFormData) {
                    window.refreshStudentFormData();
                }
                
                // Refresh faculty form data if available
                if (window.refreshFacultyFormData) {
                    window.refreshFacultyFormData();
                }
            } else {
                alert('Error adding course: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding course');
        });
    }

    // Archive and restore methods
    archiveCourse(courseId) {
        if (confirm('Are you sure you want to archive this course?')) {
            fetch(`/api/courses/${courseId}/archive`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Course archived successfully!');
                    this.loadCoursesForEditing();
                    this.loadCourseArchives();
                } else {
                    alert('Error archiving course: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error archiving course');
            });
        }
    }

    restoreCourse(courseId) {
        if (confirm('Are you sure you want to restore this course?')) {
            fetch(`/api/restore-course/${courseId}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Course restored successfully!');
                    this.loadCoursesForEditing();
                    this.loadCourseArchives();
                } else {
                    alert('Error restoring course: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error restoring course');
            });
        }
    }

    // Filter methods
    filterCourses(searchTerm) {
        const rows = document.querySelectorAll('#editCoursesTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    filterCourseArchives(searchTerm) {
        const rows = document.querySelectorAll('#courseArchivesTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    // Edit methods
    editCourse(courseId, event) {
        const row = event.currentTarget.closest('tr');
        if (!row) return;

        // Clear any existing highlighting
        this.clearAllHighlighting();

        // Add highlighting to the current row
        row.classList.add('table-warning');

        // Get current values from data attributes for accuracy
        const courseCode = row.getAttribute('data-course-code');
        const courseName = row.getAttribute('data-course-name');
        const departmentName = row.getAttribute('data-department-name');
        const credits = row.getAttribute('data-credits');
        const currentDepartmentId = row.getAttribute('data-department-id');
        
        // Debug logging
        console.log('Course data from row:', {
            courseCode,
            courseName,
            departmentName,
            credits,
            currentDepartmentId
        });

        // Replace cells with input fields
        row.cells[0].innerHTML = `<input type="text" class="form-control form-control-sm" value="${courseCode}" maxlength="20">`;
        row.cells[1].innerHTML = `<input type="text" class="form-control form-control-sm" value="${courseName}" maxlength="255">`;
        row.cells[2].innerHTML = `<select class="form-select form-select-sm" id="editDepartmentSelect">
            <option value="">Select Department</option>
        </select>`;
        row.cells[3].innerHTML = `<input type="number" class="form-control form-control-sm" value="${credits}" min="1" max="30">`;
        
        // Load departments for the select dropdown
        this.loadDepartmentsForEditForm(departmentName);
        
        // Replace action buttons with save/cancel
        row.cells[4].innerHTML = `
            <button class="btn btn-sm btn-success save-course-btn" data-course-id="${courseId}">
                <i class="fas fa-save"></i> Save
            </button>
            <button class="btn btn-sm btn-secondary cancel-course-btn" data-course-id="${courseId}">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;

        // Bind save/cancel events
        this.bindEditActions(courseId);
    }

    loadDepartmentsForEditForm(currentDepartmentName) {
        fetch('/api/departments')
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('editDepartmentSelect');
                if (select) {
                    data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.department_id;
                        option.textContent = dept.department_name;
                        if (dept.department_name === currentDepartmentName) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    });
                }
            })
            .catch(error => console.error('Error loading departments for edit:', error));
    }

    bindEditActions(courseId) {
        const row = document.querySelector(`[data-course-id="${courseId}"]`).closest('tr');
        
        // Save button
        const saveBtn = row.querySelector('.save-course-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => this.saveCourseEdit(courseId, e));
        }

        // Cancel button
        const cancelBtn = row.querySelector('.cancel-course-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => this.cancelCourseEdit(courseId, e));
        }
    }

    saveCourseEdit(courseId, event) {
        const row = event.currentTarget.closest('tr');
        const courseCode = row.cells[0].querySelector('input').value.trim();
        const courseName = row.cells[1].querySelector('input').value.trim();
        const departmentId = row.cells[2].querySelector('select').value;
        const credits = row.cells[3].querySelector('input').value.trim();

        // Validation
        if (!courseCode || !courseName || !departmentId || !credits) {
            alert('All fields are required!');
            return;
        }

        // Log the data being sent
        const requestData = {
            course_code: courseCode,
            course_name: courseName,
            department_id: departmentId,
            credits: credits
        };
        console.log('Sending course update data:', requestData);
        
        // Send update request
        fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Course updated successfully!');
                this.loadCoursesForEditing();
                
                // Refresh student form data if available
                if (window.refreshStudentFormData) {
                    window.refreshStudentFormData();
                }
                
                // Refresh faculty form data if available
                if (window.refreshFacultyFormData) {
                    window.refreshFacultyFormData();
                }
            } else {
                alert('Error updating course: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating course');
        });
    }

    cancelCourseEdit(courseId, event) {
        this.clearAllHighlighting();
        this.loadCoursesForEditing();
    }

    clearAllHighlighting() {
        document.querySelectorAll('.table-warning').forEach(row => {
            row.classList.remove('table-warning');
        });
    }
}

// Module will be initialized by SettingsPage when content is shown
