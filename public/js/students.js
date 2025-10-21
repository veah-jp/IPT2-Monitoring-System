// Students Page JavaScript
class StudentsPage {
    constructor() {
        this.studentSearch = document.getElementById('studentSearch');
        this.courseFilter = document.getElementById('courseFilter');
        this.departmentFilter = document.getElementById('departmentFilter');
        this.studentTable = document.querySelector('.table tbody');
        this.isInlineEditingMode = false;
        this.isArchiveMode = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSearch();
        this.setupFilters();
        this.populateDepartmentFilter();
        this.restoreFilterState();
        this.makeRefreshMethodGlobal();
    }

    bindEvents() {
        // Search functionality
        if (this.studentSearch) {
            this.studentSearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Course filter
        if (this.courseFilter) {
            this.courseFilter.addEventListener('change', (e) => {
                this.applyFilters();
                // Save the selected course to localStorage
                const departmentValue = this.departmentFilter?.value || '';
                this.saveFilterState(departmentValue, e.target.value);
            });
        }

        // Department filter
        if (this.departmentFilter) {
            console.log('Setting up department filter event listener');
            this.departmentFilter.addEventListener('change', (e) => {
                console.log('Department filter changed to:', e.target.value);
                this.handleDepartmentChange(e.target.value);
            });
        } else {
            console.log('Department filter element not found');
        }

        // Action buttons
        this.setupActionButtons();
    }

    async populateDepartmentFilter() {
        try {
            if (!this.departmentFilter) return;

            const response = await fetch('/api/departments');
            const data = await response.json();

            // Only show active departments
            const activeDepartments = (data || []).filter(d => d.is_active !== 0);

            // Reset options
            this.departmentFilter.innerHTML = '<option value="">Filter by Department</option>';

            activeDepartments.forEach(dept => {
                const option = document.createElement('option');
                option.value = String(dept.department_id);
                option.textContent = dept.department_name;
                this.departmentFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error populating department filter:', error);
        }
    }

    setupSearch() {
        // Initialize search with debouncing
        let searchTimeout;
        if (this.studentSearch) {
            this.studentSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    setupFilters() {
        // Filters are already set up in bindEvents method
        // This method is kept for potential future use
    }

    setupActionButtons() {
        // Add Students button
        const addStudentsBtn = document.getElementById('addStudentsBtn');
        if (addStudentsBtn) {
            addStudentsBtn.addEventListener('click', () => {
                this.showAddStudentModal();
            });
        }

        // Edit Selected button - Toggle inline editing mode
        const editSelectedBtn = document.getElementById('editSelectedBtn');
        if (editSelectedBtn) {
            editSelectedBtn.addEventListener('click', () => {
                this.toggleInlineEditing();
            });
        }

        // Archive Students button - Toggle archive mode
        const archiveStudentsBtn = document.getElementById('archiveStudentsBtn');
        if (archiveStudentsBtn) {
            archiveStudentsBtn.addEventListener('click', () => {
                this.toggleArchiveMode();
            });
        }

        // Setup inline editing functionality
        this.setupInlineEditing();

    


        // Add Student Form
        const addStudentForm = document.getElementById('addStudentForm');
        if (addStudentForm) {
            addStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted, calling handleAddStudent');
                this.handleAddStudent();
            });
        }

        // Clear Form Button
        const clearFormBtn = document.getElementById('clearForm');
        if (clearFormBtn) {
            clearFormBtn.addEventListener('click', () => {
                this.clearForm();
            });
        }

        // Department dropdown for form
        const formDepartmentSelect = document.getElementById('department_id');
        if (formDepartmentSelect) {
            formDepartmentSelect.addEventListener('change', (e) => {
                this.handleFormDepartmentChange(e.target.value);
            });
        }

        // Modal event listeners
        const addStudentModal = document.getElementById('addStudentModal');
        if (addStudentModal) {
            addStudentModal.addEventListener('hidden.bs.modal', () => {
                this.clearForm();
            });
        }

    




        // Edit Student Form
        const editStudentForm = document.getElementById('editStudentForm');
        if (editStudentForm) {
            editStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditStudent();
            });
        }

        // Department dropdown for edit form
        const editDepartmentSelect = document.getElementById('edit_department_id');
        if (editDepartmentSelect) {
            editDepartmentSelect.addEventListener('change', (e) => {
                this.handleEditDepartmentChange(e.target.value);
            });
        }

        // Modal accessibility improvements
        this.setupModalAccessibility();
        
        // Setup edit modal event listeners
        this.setupEditModalEvents();
    }

    handleSearch(searchTerm) {
        if (!this.studentTable) return;

        const rows = this.studentTable.querySelectorAll('tr');
        const searchLower = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(searchLower);
            row.style.display = isVisible ? '' : 'none';
        });
    }

    handleCourseFilter(courseValue) {
        if (!this.studentTable) return;

        const rows = this.studentTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (!courseValue) {
                row.style.display = '';
                return;
            }

            // Check if the row contains the selected course
            const courseCell = row.querySelector('td:nth-child(3)'); // Course column
            if (courseCell) {
                const courseText = courseCell.textContent.toLowerCase();
                const isVisible = courseText.includes(courseValue.toLowerCase());
                row.style.display = isVisible ? '' : 'none';
            }
        });
    }

    handleDepartmentChange(departmentValue) {
        console.log('handleDepartmentChange called with:', departmentValue);
        
        // Save the selected department to localStorage
        this.saveFilterState(departmentValue, '');
        
        // Hide course filter if no department selected
        if (!departmentValue) {
            console.log('No department selected, hiding course filter');
            this.hideCourseFilter();
            this.applyFilters();
            return;
        }

        console.log('Loading courses for department:', departmentValue);
        // Load courses for the selected department and show course filter
        this.loadCoursesByDepartment(departmentValue).then(() => {
            console.log('Courses loaded, applying filters');
            // After loading courses, apply filters to show only students from selected department
            this.applyFilters();
        });
    }

    hideCourseFilter() {
        const courseFilterContainer = document.getElementById('courseFilterContainer');
        if (courseFilterContainer) {
            courseFilterContainer.style.display = 'none';
        }
        // Reset course filter
        if (this.courseFilter) {
            this.courseFilter.value = '';
        }
    }

    async loadCoursesByDepartment(departmentValue) {
        try {
            console.log('Fetching courses for department:', departmentValue);
            const response = await fetch(`/api/courses-by-department?department_id=${encodeURIComponent(departmentValue)}`);
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Courses data:', data);
            
            if (data.courses && data.courses.length > 0) {
                console.log('Populating course filter with', data.courses.length, 'courses');
                this.populateCourseFilter(data.courses);
                this.showCourseFilter();
            } else {
                console.log('No courses found, hiding course filter');
                this.hideCourseFilter();
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            this.hideCourseFilter();
        }
    }

    populateCourseFilter(courses) {
        if (!this.courseFilter) return;

        // Clear existing options except the first one
        this.courseFilter.innerHTML = '<option value="">Filter by Course</option>';
        
        // Add course options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_name;
            option.textContent = course.course_name;
            this.courseFilter.appendChild(option);
        });
    }

    showCourseFilter() {
        const courseFilterContainer = document.getElementById('courseFilterContainer');
        if (courseFilterContainer) {
            courseFilterContainer.style.display = 'block';
        }
    }

    handleDepartmentFilter(departmentValue) {
        if (!this.studentTable) return;

        const rows = this.studentTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (!departmentValue) {
                row.style.display = '';
                return;
            }

            // Check if the row contains the selected department
            const deptCell = row.querySelector('td:nth-child(5)'); // Department column
            if (deptCell) {
                const deptText = deptCell.textContent.toLowerCase().trim();
                // Handle department IDs
                let isVisible = false;
                if (departmentValue === '1') {
                    // CSP department
                    isVisible = deptText.includes('csp');
                } else if (departmentValue === '2') {
                    // Engineering department
                    isVisible = deptText.includes('engineering');
                } else if (departmentValue === '3') {
                    // BAP department
                    isVisible = deptText.includes('bap');
                } else if (departmentValue === '4') {
                    // ASP department
                    isVisible = deptText.includes('asp');
                }
                row.style.display = isVisible ? '' : 'none';
            }
        });
    }

    applyFilters() {
        console.log('applyFilters called');
        const courseValue = this.courseFilter?.value || '';
        const departmentValue = this.departmentFilter?.value || '';
        const searchValue = this.studentSearch?.value || '';
        
        console.log('Filter values - Course:', courseValue, 'Department:', departmentValue, 'Search:', searchValue);

        if (!this.studentTable) {
            console.log('No student table found');
            return;
        }

        const rows = this.studentTable.querySelectorAll('tr');
        console.log('Found', rows.length, 'rows to filter');
        
        rows.forEach(row => {
            let isVisible = true;

            // Apply course filter
            if (courseValue) {
                const courseCell = row.querySelector('td:nth-child(4)'); // Course column
                if (courseCell) {
                    // Look for the editable-text element (the badge) instead of the entire cell
                    const courseTextElement = courseCell.querySelector('.editable-text');
                    if (courseTextElement) {
                        const courseText = courseTextElement.textContent.toLowerCase();
                        console.log('Checking course text element:', courseText, 'for course value:', courseValue);
                        isVisible = isVisible && courseText.includes(courseValue.toLowerCase());
                    } else {
                        console.log('No editable-text element found in course cell');
                        isVisible = false;
                    }
                }
            }

            // Apply department filter by matching text with selected option's label
            if (departmentValue && isVisible) {
                const deptCell = row.querySelector('td:nth-child(5)'); // Department column
                if (deptCell) {
                    // Look for the editable-text element (the badge) instead of the entire cell
                    const deptTextElement = deptCell.querySelector('.editable-text');
                    if (deptTextElement) {
                        const deptText = deptTextElement.textContent.toLowerCase().trim();
                        const selectedOption = this.departmentFilter.options[this.departmentFilter.selectedIndex];
                        const selectedLabel = selectedOption ? selectedOption.text.toLowerCase().trim() : '';
                        const deptMatch = selectedLabel ? deptText.includes(selectedLabel) : true;
                        isVisible = isVisible && deptMatch;
                    } else {
                        console.log('No editable-text element found in department cell');
                        isVisible = false;
                    }
                }
            }

            // Apply search filter
            if (searchValue && isVisible) {
                const text = row.textContent.toLowerCase();
                isVisible = isVisible && text.includes(searchValue.toLowerCase());
            }

            console.log('Row visibility:', isVisible, 'for row with student:', row.textContent.substring(0, 50));
            row.style.display = isVisible ? '' : 'none';
        });
    }



    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Method to refresh student data
    refreshStudentsData() {
        // This method can be called to refresh the students table
        // For now, we'll just log it
        console.log('Refreshing students data...');
        
        // In a real application, you might:
        // 1. Fetch fresh data from the server
        // 2. Update the table content
        // 3. Reset filters
        // 4. Update pagination
    }

    // Method to clear all filters
    clearFilters() {
        if (this.studentSearch) this.studentSearch.value = '';
        if (this.courseFilter) this.courseFilter.value = '';
        if (this.departmentFilter) this.departmentFilter.value = '';
        
        // Clear localStorage
        this.clearFilterState();
        
        // Hide course filter when clearing
        this.hideCourseFilter();
        
        // Show all rows
        if (this.studentTable) {
            const rows = this.studentTable.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
            });
        }
    }

    // Save filter state to localStorage
    saveFilterState(department, course) {
        localStorage.setItem('studentsFilterState', JSON.stringify({
            department: department,
            course: course,
            timestamp: Date.now()
        }));
    }

    // Restore filter state from localStorage
    restoreFilterState() {
        try {
            const savedState = localStorage.getItem('studentsFilterState');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Check if the saved state is not too old (24 hours)
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    // Restore department filter
                    if (state.department && this.departmentFilter) {
                        this.departmentFilter.value = state.department;
                        
                        // Load courses for the department and restore course filter
                        this.loadCoursesByDepartment(state.department).then(() => {
                            if (state.course && this.courseFilter) {
                                this.courseFilter.value = state.course;
                                // Apply filters after restoring both
                                setTimeout(() => this.applyFilters(), 100);
                            }
                        });
                    }
                } else {
                    // Clear old state
                    this.clearFilterState();
                }
            }
        } catch (error) {
            console.error('Error restoring filter state:', error);
            this.clearFilterState();
        }
    }

    // Clear filter state from localStorage
    clearFilterState() {
        localStorage.removeItem('studentsFilterState');
    }

    // Form visibility methods
    showAddStudentModal() {
        const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
        modal.show();
        
        // Load departments and reset form when modal is shown
        this.loadDepartmentsForForm();
        this.clearForm();
    }

    // Form handling methods
    handleAddStudent() {
        const form = document.getElementById('addStudentForm');
        if (!form) return;

        const formData = new FormData(form);
        const studentData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            gender: formData.get('gender'),
            date_of_birth: formData.get('date_of_birth'),
            address: formData.get('address'),
            course_id: formData.get('course_id'),
            year: formData.get('year')
        };

        // Debug: Log the student data to see what's being captured
        console.log('Student Data being submitted:', studentData);

        // Validate required fields
        if (!studentData.first_name || !studentData.last_name || !studentData.gender || 
            !studentData.date_of_birth || !studentData.address || !studentData.course_id || !studentData.year) {
            
            // Debug: Show which specific fields are missing
            const missingFields = [];
            if (!studentData.first_name) missingFields.push('First Name');
            if (!studentData.last_name) missingFields.push('Last Name');
            if (!studentData.gender) missingFields.push('Gender');
            if (!studentData.date_of_birth) missingFields.push('Date of Birth');
            if (!studentData.address) missingFields.push('Address');
            if (!studentData.course_id) missingFields.push('Course (Please select a department first, then select a course)');
            if (!studentData.year) missingFields.push('Year');
            
            console.log('Missing fields:', missingFields);
            console.log('Form data being submitted:', studentData);
            this.showNotification(`Please fill in all required fields. Missing: ${missingFields.join(', ')}`, 'error');
            return;
        }



        // Submit student data
        this.submitStudent(studentData);
    }

    async submitStudent(studentData) {
        try {
            const response = await fetch('/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(studentData)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Student added successfully!', 'success');
                this.clearForm();
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
                if (modal) {
                    modal.hide();
                }
                // Refresh the page to show the new student
                window.location.reload();
            } else {
                this.showNotification(result.message || 'Error adding student.', 'error');
            }
        } catch (error) {
            console.error('Error submitting student:', error);
            this.showNotification('Error adding student. Please try again.', 'error');
        }
    }

    clearForm() {
        const form = document.getElementById('addStudentForm');
        if (form) {
            form.reset();
            // Reset course dropdown
            const courseSelect = document.getElementById('course_id');
            if (courseSelect) {
                courseSelect.innerHTML = '<option value="">Select Department First</option>';
                courseSelect.disabled = true;
            }
            // Reset department dropdown
            const departmentSelect = document.getElementById('department_id');
            if (departmentSelect) {
                departmentSelect.value = '';
            }

        }
    }



    handleFormDepartmentChange(departmentValue) {
        const courseSelect = document.getElementById('course_id');
        if (!courseSelect) return;

        if (!departmentValue) {
            courseSelect.innerHTML = '<option value="">Select Department First</option>';
            courseSelect.disabled = true;
            return;
        }

        // Load courses for the selected department
        this.loadCoursesForForm(departmentValue);
    }

    async loadDepartmentsForForm() {
        try {
            const response = await fetch('/api/departments');
            const data = await response.json();
            
            const departmentSelect = document.getElementById('department_id');
            if (departmentSelect && data && data.length > 0) {
                // Filter out archived departments (only show active ones)
                const activeDepartments = data.filter(dept => dept.is_active !== 0);
                
                departmentSelect.innerHTML = '<option value="">Select Department</option>';
                activeDepartments.forEach(department => {
                    const option = document.createElement('option');
                    option.value = department.department_id;
                    option.textContent = department.department_name;
                    departmentSelect.appendChild(option);
                });
            } else {
                departmentSelect.innerHTML = '<option value="">No departments available</option>';
            }
        } catch (error) {
            console.error('Error loading departments for form:', error);
            const departmentSelect = document.getElementById('department_id');
            if (departmentSelect) {
                departmentSelect.innerHTML = '<option value="">Error loading departments</option>';
            }
        }
    }

    // Method to refresh form data (can be called from settings page)
    async refreshFormData() {
        await this.loadDepartmentsForForm();
        
        // If a department is currently selected, refresh its courses too
        const departmentSelect = document.getElementById('department_id');
        if (departmentSelect && departmentSelect.value) {
            await this.loadCoursesForForm(departmentSelect.value);
        }
    }

    // Make refreshFormData available globally
    makeRefreshMethodGlobal() {
        window.refreshStudentFormData = () => this.refreshFormData();
    }

    async loadCoursesForForm(departmentValue) {
        try {
            const response = await fetch(`/api/courses-by-department?department_id=${encodeURIComponent(departmentValue)}`);
            const data = await response.json();
            
            const courseSelect = document.getElementById('course_id');
            if (courseSelect && data.courses && data.courses.length > 0) {
                // Filter out archived courses (only show active ones)
                const activeCourses = data.courses.filter(course => course.is_active !== 0);
                
                courseSelect.innerHTML = '<option value="">Select Course</option>';
                activeCourses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.course_id;
                    option.textContent = course.course_name;
                    courseSelect.appendChild(option);
                });
                courseSelect.disabled = false;
            } else {
                courseSelect.innerHTML = '<option value="">No courses available</option>';
                courseSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error loading courses for form:', error);
            const courseSelect = document.getElementById('course_id');
            if (courseSelect) {
                courseSelect.innerHTML = '<option value="">Error loading courses</option>';
                courseSelect.disabled = true;
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }





    // Inline Editing Methods
    setupInlineEditing() {
        console.log('Setting up inline editing...');
        
        // Single consolidated click event listener for all inline editing actions
        document.addEventListener('click', (e) => {
            console.log('Click event detected on:', e.target);
            console.log('Is inline editing mode:', this.isInlineEditingMode);
            
            // Handle editable text clicks
            if (e.target.closest('.editable-text') && this.isInlineEditingMode) {
                console.log('Starting inline editing for cell:', e.target.closest('td'));
                this.startEditing(e.target.closest('td'));
            }
            
            // Handle edit row button clicks
            if (e.target.closest('.edit-row-btn')) {
                const editBtn = e.target.closest('.edit-row-btn');
                const studentId = editBtn.dataset.studentId;
                console.log('Edit button clicked for student:', studentId);
                console.log('Edit button element:', editBtn);
                console.log('Edit button dataset:', editBtn.dataset);
                this.startEditingRow(studentId);
            }
            
            // Handle save row button clicks
            if (e.target.closest('.save-row-btn')) {
                const studentId = e.target.closest('.save-row-btn').dataset.studentId;
                console.log('Save button clicked for student:', studentId);
                this.saveRow(studentId);
            }
            
            // Handle cancel row button clicks
            if (e.target.closest('.cancel-row-btn')) {
                const studentId = e.target.closest('.cancel-row-btn').dataset.studentId;
                console.log('Cancel button clicked for student:', studentId);
                this.cancelEditingRow(studentId);
            }

            // Handle archive row button clicks
            if (e.target.closest('.archive-row-btn')) {
                const studentId = e.target.closest('.archive-row-btn').dataset.studentId;
                console.log('Archive button clicked for student:', studentId);
                this.archiveStudent(studentId);
            }



            // Handle cancel archive button clicks
            if (e.target.closest('.cancel-archive-btn')) {
                const studentId = e.target.closest('.cancel-archive-btn').dataset.studentId;
                console.log('Cancel archive button clicked for student:', studentId);
                this.cancelArchiveRow(studentId);
            }
        });
    }

    toggleInlineEditing() {
        console.log('Toggling inline editing mode...');
        this.isInlineEditingMode = !this.isInlineEditingMode;
        const editBtn = document.getElementById('editSelectedBtn');
        
        console.log('Inline editing mode:', this.isInlineEditingMode);
        console.log('Edit button found:', editBtn);
        
        if (this.isInlineEditingMode) {
            editBtn.innerHTML = '<i class="fas fa-times me-2"></i>Exit Edit Mode';
            editBtn.classList.remove('btn-outline-secondary');
            editBtn.classList.add('btn-success');
            
            // Show all row action buttons
            this.showAllRowActionButtons();
            
            this.showNotification('Action buttons are now visible. Click individual Edit buttons to edit rows.', 'success');
            console.log('Action buttons mode activated');
        } else {
            editBtn.innerHTML = '<i class="fas fa-user-edit me-2"></i>Edit Student';
            editBtn.classList.remove('btn-success');
            editBtn.classList.add('btn-outline-secondary');
            this.exitInlineEditingMode();
            this.showNotification('Action buttons hidden.', 'info');
            console.log('Action buttons mode deactivated');
        }
    }

    showAllRowActionButtons() {
        // Show all edit buttons in the table
        const editButtons = document.querySelectorAll('.edit-row-btn');
        editButtons.forEach(btn => {
            btn.classList.remove('d-none');
        });
        console.log('Showed', editButtons.length, 'edit buttons');
    }

    hideAllRowActionButtons() {
        // Hide all action buttons in the table
        const editButtons = document.querySelectorAll('.edit-row-btn');
        const saveButtons = document.querySelectorAll('.save-row-btn');
        const cancelButtons = document.querySelectorAll('.cancel-row-btn');
        
        console.log('Found buttons to hide - Edit:', editButtons.length, 'Save:', saveButtons.length, 'Cancel:', cancelButtons.length);
        
        editButtons.forEach((btn, index) => {
            btn.classList.add('d-none');
            console.log(`Hidden edit button ${index + 1}:`, btn);
        });
        
        saveButtons.forEach((btn, index) => {
            btn.classList.add('d-none');
            console.log(`Hidden save button ${index + 1}:`, btn);
        });
        
        cancelButtons.forEach((btn, index) => {
            btn.classList.add('d-none');
            console.log(`Hidden cancel button ${index + 1}:`, btn);
        });
        
        console.log('Hidden all action buttons');
    }

    startEditing(cell) {
        console.log('startEditing called with cell:', cell);
        
        const row = cell.closest('tr');
        if (!row) {
            console.log('No row found, returning');
            return;
        }
        
        // If we're in global edit mode but this row isn't in editing mode yet,
        // automatically put it into editing mode
        if (this.isInlineEditingMode && !row.classList.contains('editing-row')) {
            console.log('Auto-activating row for editing');
            this.startEditingRow(cell.dataset.studentId);
        }
        
        // Check if the row is now in editing mode
        if (!row.classList.contains('editing-row')) {
            console.log('Row is not in editing mode, returning');
            return;
        }
        
        const editableText = cell.querySelector('.editable-text');
        const editableInput = cell.querySelector('.editable-input');
        
        console.log('Found editableText:', editableText);
        console.log('Found editableInput:', editableInput);
        
        if (editableText && editableInput) {
            console.log('Hiding text, showing input');
            editableText.classList.add('d-none');
            editableInput.classList.remove('d-none');
            editableInput.focus();
            
            // Remove auto-save on blur - only save button saves now
            if (editableInput.tagName === 'INPUT' || editableInput.tagName === 'TEXTAREA') {
                editableInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.cancelEditing(cell);
                    }
                });
            } else if (editableInput.tagName === 'SELECT') {
                // No auto-save for selects either
            }
        } else {
            console.log('Missing editableText or editableInput elements');
        }
    }

    startEditingRow(studentId) {
        console.log('startEditingRow called for student ID:', studentId);
        
        // Find the row by looking for the edit button with the matching student ID
        const editBtn = document.querySelector(`.edit-row-btn[data-student-id="${studentId}"]`);
        if (!editBtn) {
            console.log('No edit button found for student ID:', studentId);
            return;
        }
        
        const row = editBtn.closest('tr');
        if (!row) {
            console.log('No row found for student ID:', studentId);
            return;
        }
        
        console.log('Found row:', row);
        console.log('Row HTML:', row.outerHTML.substring(0, 200) + '...');
        
        // Add glowing effect to the row
        row.classList.add('editing-row');
        console.log('Added editing-row class to row');
        
        // Show save/cancel buttons for this row
        const saveBtn = row.querySelector('.save-row-btn');
        const cancelBtn = row.querySelector('.cancel-row-btn');
        const editBtnInRow = row.querySelector('.edit-row-btn');
        
        console.log('Found buttons - Save:', saveBtn, 'Cancel:', cancelBtn, 'Edit:', editBtnInRow);
        
        if (saveBtn && cancelBtn && editBtnInRow) {
            saveBtn.classList.remove('d-none');
            cancelBtn.classList.remove('d-none');
            editBtnInRow.classList.add('d-none');
            console.log('Updated button visibility for row');
        } else {
            console.log('Some buttons not found in row');
        }
        
        // Make all editable cells in this row clickable (cursor only, click handling is done at document level)
        const editableTexts = row.querySelectorAll('.editable-text');
        editableTexts.forEach(text => {
            text.style.cursor = 'pointer';
        });
        
        console.log('Made', editableTexts.length, 'cells clickable (cursor only)');
    }



    saveCell(cell) {
        const editableText = cell.querySelector('.editable-text');
        const editableInput = cell.querySelector('.editable-input');
        const field = cell.dataset.field;
        const studentId = cell.dataset.studentId;
        
        if (editableText && editableInput && field && studentId) {
            let newValue = editableInput.value;
            
            // Update the display text
            if (editableInput.tagName === 'SELECT') {
                const selectedOption = editableInput.querySelector('option:checked');
                newValue = selectedOption ? selectedOption.textContent : '';
                
                // Update badge styling for certain fields
                if (field === 'gender') {
                    editableText.className = 'editable-text badge bg-secondary';
                } else if (field === 'year') {
                    editableText.className = 'editable-text badge bg-info';
                } else if (field === 'course_id') {
                    editableText.className = 'editable-text badge bg-success';
                } else if (field === 'department_id') {
                    editableText.className = 'editable-text badge bg-primary';
                }
            }
            
            editableText.textContent = newValue;
            editableText.classList.remove('d-none');
            editableInput.classList.add('d-none');
            
            // Save to backend
            this.saveFieldToBackend(studentId, field, editableInput.value);
        }
    }

    saveRow(studentId) {
        console.log('saveRow called for student ID:', studentId);
        
        // Find the row by looking for the edit button with the matching student ID
        const editBtn = document.querySelector(`.edit-row-btn[data-student-id="${studentId}"]`);
        if (!editBtn) {
            console.log('No edit button found for student ID:', studentId);
            return;
        }
        
        const row = editBtn.closest('tr');
        if (!row) {
            console.log('No row found for student ID:', studentId);
            return;
        }
        
        console.log('Found row for saving:', row);
        
        // Collect all changed values from the row
        const changes = {};
        const editableInputs = row.querySelectorAll('.editable-input');
        
        console.log('Found', editableInputs.length, 'editable inputs');
        
        editableInputs.forEach(input => {
            const cell = input.closest('td');
            const field = cell.dataset.field;
            if (field && input.value.trim() !== '') {
                changes[field] = input.value;
                console.log('Adding field to changes:', field, '=', input.value);
            } else if (field && input.value.trim() === '') {
                console.log('Skipping empty field:', field);
            }
        });
        
        console.log('Changes to save:', changes);
        
        // Save all changes to backend
        this.saveRowToBackend(studentId, changes);
        
        // Reset buttons and remove glowing effect
        this.resetRowButtons(row);
        
        // Cancel all editing in the row after saving
        const editableInputs2 = row.querySelectorAll('.editable-input');
        editableInputs2.forEach(input => {
            const cell = input.closest('td');
            this.cancelEditing(cell);
        });
    }

    cancelEditing(cell) {
        const editableText = cell.querySelector('.editable-text');
        const editableInput = cell.querySelector('.editable-input');
        
        if (editableText && editableInput) {
            editableText.classList.remove('d-none');
            editableInput.classList.add('d-none');
        }
    }

    cancelEditingRow(studentId) {
        console.log('cancelEditingRow called for student ID:', studentId);
        
        // Find the row by looking for the edit button with the matching student ID
        const editBtn = document.querySelector(`.edit-row-btn[data-student-id="${studentId}"]`);
        if (!editBtn) {
            console.log('No edit button found for student ID:', studentId);
            return;
        }
        
        const row = editBtn.closest('tr');
        if (!row) {
            console.log('No row found for student ID:', studentId);
            return;
        }
        
        console.log('Found row for canceling:', row);
        
        // Remove glowing effect
        row.classList.remove('editing-row');
        
        // Cancel all editing in the row
        const editableInputs = row.querySelectorAll('.editable-input');
        editableInputs.forEach(input => {
            const cell = input.closest('td');
            this.cancelEditing(cell);
        });
        
        // Reset buttons
        this.resetRowButtons(row);
    }

    resetRowButtons(row) {
        const saveBtn = row.querySelector('.save-row-btn');
        const cancelBtn = row.querySelector('.cancel-row-btn');
        const editBtn = row.querySelector('.edit-row-btn');
        
        if (saveBtn && cancelBtn && editBtn) {
            saveBtn.classList.add('d-none');
            cancelBtn.classList.add('d-none');
            editBtn.classList.remove('d-none');
        }
        
        // Remove glowing effect
        row.classList.remove('editing-row');
        
        // Reset cursor style for all editable text in the row
        const editableTexts = row.querySelectorAll('.editable-text');
        editableTexts.forEach(text => {
            text.style.cursor = 'default';
        });
    }

    exitInlineEditingMode() {
        this.isInlineEditingMode = false;
        
        console.log('Exiting inline editing mode...');
        
        // Cancel all editing
        const editableInputs = document.querySelectorAll('.editable-input');
        editableInputs.forEach(input => {
            const cell = input.closest('td');
            this.cancelEditing(cell);
        });
        
        // Hide all row action buttons
        this.hideAllRowActionButtons();
        
        // Remove glowing effects and reset cursor styles (but don't show edit buttons)
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            row.classList.remove('editing-row');
            
            // Reset cursor style for all editable text in the row
            const editableTexts = row.querySelectorAll('.editable-text');
            editableTexts.forEach(text => {
                text.style.cursor = 'default';
            });
        });
        
        console.log('Exited inline editing mode');
    }

    // Archive Mode Methods
    toggleArchiveMode() {
        if (this.isArchiveMode) {
            this.exitArchiveMode();
        } else {
            this.enterArchiveMode();
        }
    }

    enterArchiveMode() {
        console.log('Entering archive mode');
        this.isArchiveMode = true;
        
        // Exit edit mode if it's active
        if (this.isInlineEditingMode) {
            this.exitInlineEditingMode();
        }
        
        // Show archive action buttons
        this.showAllArchiveButtons();
        
        // Update button states
        const archiveBtn = document.getElementById('archiveStudentsBtn');
        if (archiveBtn) {
            archiveBtn.textContent = 'Exit Archive Mode';
            archiveBtn.classList.remove('btn-outline-info');
            archiveBtn.classList.add('btn-info');
        }
        
        console.log('Archive mode activated');
    }

    exitArchiveMode() {
        console.log('Exiting archive mode');
        this.isArchiveMode = false;
        
        // Hide all archive action buttons
        this.hideAllArchiveButtons();
        
        // Update button states
        const archiveBtn = document.getElementById('archiveStudentsBtn');
        if (archiveBtn) {
            archiveBtn.textContent = 'Archive Students';
            archiveBtn.classList.remove('btn-info');
            archiveBtn.classList.add('btn-outline-info');
        }
        
        console.log('Archive mode deactivated');
    }

    showAllArchiveButtons() {
        // Show all archive buttons in the table
        const archiveButtons = document.querySelectorAll('.archive-row-btn');
        const cancelArchiveButtons = document.querySelectorAll('.cancel-archive-btn');
        
        archiveButtons.forEach(btn => {
            btn.classList.remove('d-none');
        });
        
        cancelArchiveButtons.forEach(btn => {
            btn.classList.remove('d-none');
        });
        
        console.log('Showed', archiveButtons.length, 'archive buttons');
    }

    hideAllArchiveButtons() {
        // Hide all archive action buttons in the table
        const archiveButtons = document.querySelectorAll('.archive-row-btn');
        const cancelArchiveButtons = document.querySelectorAll('.cancel-archive-btn');
        
        archiveButtons.forEach(btn => {
            btn.classList.add('d-none');
        });
        
        cancelArchiveButtons.forEach(btn => {
            btn.classList.add('d-none');
        });
        
        console.log('Hidden all archive action buttons');
    }

    // Archive Action Methods
    async archiveStudent(studentId) {
        if (!confirm('Are you sure you want to archive this student? This will move them to the archives.')) {
            return;
        }

        try {
            const response = await fetch(`/students/${studentId}/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                this.showNotification('Student archived successfully!', 'success');
                // Remove the row from the table
                const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
                if (row) {
                    row.remove();
                }
            } else {
                this.showNotification('Error archiving student', 'error');
            }
        } catch (error) {
            console.error('Error archiving student:', error);
            this.showNotification('Error archiving student', 'error');
        }
    }



    cancelArchiveRow(studentId) {
        // This method can be used for any cleanup if needed
        console.log('Archive cancelled for student:', studentId);
    }

    async saveFieldToBackend(studentId, field, value) {
        try {
            const response = await fetch(`/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    [field]: value
                })
            });

            if (response.ok) {
                this.showNotification(`Updated ${field} successfully!`, 'success');
            } else {
                this.showNotification(`Error updating ${field}`, 'error');
            }
        } catch (error) {
            console.error('Error saving field:', error);
            this.showNotification(`Error updating ${field}`, 'error');
        }
    }

    async saveRowToBackend(studentId, changes) {
        try {
            const response = await fetch(`/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(changes)
            });

            if (response.ok) {
                this.showNotification('Student updated successfully!', 'success');
                
                // Refresh the page after successful save
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Wait 1 second for the notification to be visible
            } else {
                this.showNotification('Error updating student', 'error');
            }
        } catch (error) {
            console.error('Error saving row:', error);
            this.showNotification('Error updating student', 'error');
        }
    }

    showEditStudentModal(studentId) {
        // Show the edit modal
        const modalElement = document.getElementById('editStudentModal');
        const modal = new bootstrap.Modal(modalElement);
        
        // Store the student ID for the modal event listener
        modalElement.setAttribute('data-current-student-id', studentId);
        
        // Show the modal
        modal.show();
    }

    async populateEditForm(studentId) {
        try {
            console.log('Fetching data for student ID:', studentId); // Debug log
            
            // Fetch complete student data from the API
            const response = await fetch(`/students/${studentId}/edit`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status); // Debug log
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Data received:', result); // Debug log
            
            if (!result.success) {
                this.showNotification('Error fetching student data: ' + (result.message || 'Unknown error'), 'error');
                return;
            }
            
            const student = result.student;
            
            // Populate the form fields with complete data
            document.getElementById('edit_student_id').value = student.student_id || '';
            document.getElementById('edit_first_name').value = student.first_name || '';
            document.getElementById('edit_last_name').value = student.last_name || '';
            document.getElementById('edit_gender').value = student.gender || '';
            document.getElementById('edit_date_of_birth').value = student.date_of_birth || '';
            document.getElementById('edit_address').value = student.address || '';
            document.getElementById('edit_year').value = student.year || '';
            
            // Set department and course
            if (student.course && student.course.department) {
                const departmentId = student.course.department.department_id.toString();
                document.getElementById('edit_department_id').value = departmentId;
                
                // Load courses for this department and set the current course
                await this.loadCoursesForEditForm(departmentId);
                
                // Set the current course
                const courseSelect = document.getElementById('edit_course_id');
                if (courseSelect) {
                    courseSelect.value = student.course_id || '';
                }
            }
            
            console.log('Form populated successfully'); // Debug log
            
        } catch (error) {
            console.error('Error fetching student data:', error);
            this.showNotification('Error fetching student data. Please try again.', 'error');
        }
    }
    

    
    clearEditForm() {
        // Clear all form fields
        const form = document.getElementById('editStudentForm');
        if (form) {
            form.reset();
        }
        
        // Clear specific fields manually to ensure they're empty
        const fields = [
            'edit_student_id',
            'edit_first_name', 
            'edit_last_name',
            'edit_gender',
            'edit_date_of_birth',
            'edit_address',
            'edit_year',
            'edit_department_id'
        ];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });
        
        // Reset course dropdown
        const courseSelect = document.getElementById('edit_course_id');
        if (courseSelect) {
            courseSelect.innerHTML = '<option value="">Select Department First</option>';
            courseSelect.disabled = true;
        }
    }
    
    setEditDepartment(departmentName) {
        const deptSelect = document.getElementById('edit_department_id');
        if (!deptSelect) return;
        
        // Find the department ID based on the name
        let departmentId = '';
        if (departmentName.includes('CSP')) departmentId = '1';
        else if (departmentName.includes('Engineering')) departmentId = '2';
        else if (departmentName.includes('BAP')) departmentId = '3';
        else if (departmentName.includes('ASP')) departmentId = '4';
        
        deptSelect.value = departmentId;
        
        // Load courses for this department
        if (departmentId) {
            this.loadCoursesForEditForm(departmentId);
        }
    }
    
    async loadCoursesForEditForm(departmentId) {
        try {
            const response = await fetch(`/api/courses-by-department?department_id=${encodeURIComponent(departmentId)}`);
            const data = await response.json();
            
            const courseSelect = document.getElementById('edit_course_id');
            if (courseSelect && data.courses && data.courses.length > 0) {
                courseSelect.innerHTML = '<option value="">Select Course</option>';
                data.courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.course_id;
                    option.textContent = course.course_name;
                    courseSelect.appendChild(option);
                });
                courseSelect.disabled = false;
            } else {
                courseSelect.innerHTML = '<option value="">No courses available</option>';
                courseSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error loading courses for edit form:', error);
            const courseSelect = document.getElementById('edit_course_id');
            if (courseSelect) {
                courseSelect.innerHTML = '<option value="">Error loading courses</option>';
                courseSelect.disabled = true;
            }
        }
    }

    handleEditStudent() {
        const form = document.getElementById('editStudentForm');
        if (!form) return;

        const formData = new FormData(form);
        const studentData = {
            first_name: formData.get('edit_first_name'),
            last_name: formData.get('edit_last_name'),
            gender: formData.get('edit_gender'),
            date_of_birth: formData.get('edit_date_of_birth'),
            address: formData.get('edit_address'),
            course_id: formData.get('edit_course_id'),
            year: formData.get('edit_year')
        };

        // Validate required fields
        if (!studentData.first_name || !studentData.last_name || !studentData.gender || 
            !studentData.date_of_birth || !studentData.address || !studentData.course_id || !studentData.year) {
            
            const missingFields = [];
            if (!studentData.first_name) missingFields.push('First Name');
            if (!studentData.last_name) missingFields.push('Last Name');
            if (!studentData.gender) missingFields.push('Gender');
            if (!studentData.date_of_birth) missingFields.push('Date of Birth');
            if (!studentData.address) missingFields.push('Address');
            if (!studentData.course_id) missingFields.push('Course');
            if (!studentData.year) missingFields.push('Year');
            
            this.showNotification(`Please fill in all required fields. Missing: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Get the student ID from the form
        const studentId = document.getElementById('edit_student_id').value;
        
        // Submit the update
        this.submitEditStudent(studentId, studentData);
    }

    async submitEditStudent(studentId, studentData) {
        try {
            const response = await fetch(`/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(studentData)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Student updated successfully!', 'success');
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editStudentModal'));
                if (modal) {
                    modal.hide();
                }
                // Refresh the page to show the updated student
                window.location.reload();
            } else {
                this.showNotification(result.message || 'Error updating student.', 'error');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            this.showNotification('Error updating student. Please try again.', 'error');
        }
    }

    handleEditDepartmentChange(departmentValue) {
        const courseSelect = document.getElementById('edit_course_id');
        if (!courseSelect) return;

        if (!departmentValue) {
            courseSelect.innerHTML = '<option value="">Select Department First</option>';
            courseSelect.disabled = true;
            return;
        }

        // Load courses for the selected department
        this.loadCoursesForEditForm(departmentValue);
    }

    setupModalAccessibility() {
        const modal = document.getElementById('editStudentModal');
        if (!modal) return;

        // Focus trap for keyboard navigation
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        // Handle Tab key navigation
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab: go to previous element
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else {
                    // Tab: go to next element
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
            
            // Escape key to close modal
            if (e.key === 'Escape') {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });

        // Ensure modal is properly announced to screen readers
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
    }
    
    setupEditModalEvents() {
        const modalElement = document.getElementById('editStudentModal');
        if (!modalElement) return;
        
        // Listen for when the edit modal is about to be shown
        modalElement.addEventListener('show.bs.modal', async (event) => {
            // Get the current student ID from the modal's data attribute
            const studentId = modalElement.getAttribute('data-current-student-id');
            if (studentId) {
                // Clear the form completely before populating
                this.clearEditForm();
                
                // Populate the form with fresh data
                await this.populateEditForm(studentId);
            }
        });
        
        // Listen for when the modal is shown (for focus management)
        modalElement.addEventListener('shown.bs.modal', (event) => {
            // Focus on the first input field when modal opens
            const firstInput = modalElement.querySelector('input:not([readonly]), select:not([disabled])');
            if (firstInput) {
                firstInput.focus();
            }
        });
        
        // Listen for when the modal is hidden (for cleanup)
        modalElement.addEventListener('hidden.bs.modal', (event) => {
            // Clear the form completely when modal is closed
            this.clearEditForm();
            
            // Remove the stored student ID
            modalElement.removeAttribute('data-current-student-id');
        });
    }
}

// Initialize students page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.studentsPage = new StudentsPage();
});

// Re-initialize when content is moved by React
document.addEventListener('studentsContentMoved', () => {
    // Destroy existing instance if it exists
    if (window.studentsPage) {
        // Clean up existing event listeners
        window.studentsPage = null;
    }
    // Create new instance
    window.studentsPage = new StudentsPage();
});
