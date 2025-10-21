// Faculty Page JavaScript with Inline Editing
class FacultyPage {
    constructor() {
        this.isInlineEditingMode = false;
        this.isArchiveMode = false;
        this.facultySearch = document.getElementById('facultySearch');
        this.departmentFilter = document.getElementById('departmentFilter');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');
        this.addFacultyBtn = document.getElementById('addFacultyBtn');
        this.editFacultyBtn = document.getElementById('editFacultyBtn');
        this.archiveFacultyBtn = document.getElementById('archiveFacultyBtn');
        this.exitEditModeBtn = document.getElementById('exitEditModeBtn');
        this.editModeRow = document.getElementById('editModeRow');
        this.facultyRows = document.querySelectorAll('tbody tr');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSearch();
        this.setupFilters();
        this.restoreFilterState();
        this.makeRefreshMethodGlobal();
    }

    bindEvents() {
        // Add Faculty button
        if (this.addFacultyBtn) {
            this.addFacultyBtn.addEventListener('click', () => {
                this.showAddFacultyModal();
            });
        }

        // Edit Faculty button
        if (this.editFacultyBtn) {
            this.editFacultyBtn.addEventListener('click', () => {
                this.enterInlineEditingMode();
            });
        }

        // Archive Faculty button
        if (this.archiveFacultyBtn) {
            this.archiveFacultyBtn.addEventListener('click', () => {
                this.toggleArchiveMode();
            });
        }

        // Exit Edit Mode button
        if (this.exitEditModeBtn) {
            this.exitEditModeBtn.addEventListener('click', () => {
                this.exitInlineEditingMode();
            });
        }

        // Search functionality
        if (this.facultySearch) {
            this.facultySearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Department filter
        if (this.departmentFilter) {
            this.departmentFilter.addEventListener('change', (e) => {
                this.handleDepartmentChange(e.target.value);
            });
        }

        // Clear filters
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Global click handler for inline editing and archive mode
        document.addEventListener('click', (e) => {
            if (this.isInlineEditingMode || this.isArchiveMode) {
                this.handleGlobalClick(e);
            }
        });

        // Add Faculty form submission
        const addFacultyForm = document.getElementById('addFacultyForm');
        if (addFacultyForm) {
            addFacultyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddFaculty();
            });
        }
    }

    setupSearch() {
        // Initialize search with debouncing
        let searchTimeout;
        if (this.facultySearch) {
            this.facultySearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    setupFilters() {
        // Initialize filters
        if (this.departmentFilter) {
            this.departmentFilter.addEventListener('change', (e) => {
                this.handleDepartmentChange(e.target.value);
            });
        }
    }

    handleSearch(searchTerm) {
        if (!this.facultyRows || this.facultyRows.length === 0) return;

        const searchLower = searchTerm.toLowerCase();

        this.facultyRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(searchLower);
            row.style.display = isVisible ? '' : 'none';
        });
    }

    handleDepartmentChange(departmentValue) {
        // Save the selected department to localStorage
        this.saveFilterState(departmentValue);
        
        // Apply filters
        this.applyFilters();
    }

    applyFilters() {
        const departmentValue = this.departmentFilter?.value || '';
        const searchValue = this.facultySearch?.value || '';

        console.log('Applying filters - Department:', departmentValue, 'Search:', searchValue);

        if (!this.facultyRows || this.facultyRows.length === 0) {
            console.log('No faculty rows found');
            return;
        }

        this.facultyRows.forEach((row, index) => {
            let isVisible = true;

            // Apply department filter
            if (departmentValue && isVisible) {
                const deptCell = row.querySelector('[data-field="department_id"]');
                if (deptCell) {
                    // Get the current department ID from the select element
                    const deptSelect = deptCell.querySelector('select');
                    if (deptSelect) {
                        const selectedOption = deptSelect.querySelector('option:checked');
                        console.log(`Row ${index + 1} - Selected dept:`, selectedOption?.value, 'Filter dept:', departmentValue);
                        if (selectedOption && selectedOption.value !== departmentValue) {
                            isVisible = false;
                            console.log(`Row ${index + 1} hidden due to department mismatch`);
                        }
                    }
                }
            }

            // Apply search filter
            if (searchValue && isVisible) {
                const text = row.textContent.toLowerCase();
                isVisible = isVisible && text.includes(searchValue.toLowerCase());
                if (!isVisible) {
                    console.log(`Row ${index + 1} hidden due to search mismatch`);
                }
            }

            row.style.display = isVisible ? '' : 'none';
            console.log(`Row ${index + 1} visibility:`, isVisible ? 'visible' : 'hidden');
        });
    }

    clearFilters() {
        if (this.facultySearch) this.facultySearch.value = '';
        if (this.departmentFilter) this.departmentFilter.value = '';
        
        // Clear localStorage
        this.clearFilterState();
        
        // Show all faculty rows
        if (this.facultyRows) {
            this.facultyRows.forEach(row => {
                row.style.display = '';
            });
        }
    }

    // Save filter state to localStorage
    saveFilterState(department) {
        localStorage.setItem('facultyFilterState', JSON.stringify({
            department: department,
            timestamp: Date.now()
        }));
    }

    // Restore filter state from localStorage
    restoreFilterState() {
        try {
            const savedState = localStorage.getItem('facultyFilterState');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Check if the saved state is not too old (24 hours)
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    // Restore department filter
                    if (state.department && this.departmentFilter) {
                        this.departmentFilter.value = state.department;
                        // Apply filters after restoring
                        setTimeout(() => this.applyFilters(), 100);
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
        localStorage.removeItem('facultyFilterState');
    }

    // Show Add Faculty Modal
    showAddFacultyModal() {
        const modal = new bootstrap.Modal(document.getElementById('addFacultyModal'));
        modal.show();
        
        // Load departments and reset form when modal is shown
        this.loadDepartmentsForForm();
        this.resetForm();
    }

    // Load departments for the faculty form
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
    }

    // Make refreshFormData available globally
    makeRefreshMethodGlobal() {
        window.refreshFacultyFormData = () => this.refreshFormData();
    }

    // Reset form method
    resetForm() {
        const form = document.getElementById('addFacultyForm');
        if (form) {
            form.reset();
        }
    }

    // Handle Add Faculty form submission
    async handleAddFaculty() {
        try {
            const form = document.getElementById('addFacultyForm');
            const formData = new FormData(form);
            
            // Convert FormData to JSON
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Debug: Log the collected form data
            console.log('Form data collected:', data);

            // Remove empty values but preserve date fields
            Object.keys(data).forEach(key => {
                if (data[key] === '' && !key.includes('date')) {
                    data[key] = null;
                }
            });

            // Debug: Log the final data being sent
            console.log('Final data being sent:', data);

            const response = await fetch('/faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(result.message, 'success');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addFacultyModal'));
                modal.hide();
                
                // Reset form
                form.reset();
                
                // Refresh the page after successful addition
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error adding faculty:', error);
            this.showNotification('Error adding faculty member', 'error');
        }
    }

    // Enter inline editing mode
    enterInlineEditingMode() {
        console.log('Entering inline editing mode...');
        this.isInlineEditingMode = true;
        
        // Show exit edit mode row, hide action buttons row
        this.editModeRow.style.display = 'block';
        
        // Show all edit buttons
        this.showAllRowActionButtons();
        
        // Make all editable cells clickable
        this.makeAllCellsEditable();
        
        console.log('Entered inline editing mode');
    }

    // Exit inline editing mode
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
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.classList.remove('editing-row');
            
            // Reset cursor style for all editable text in the row
            const editableTexts = row.querySelectorAll('.editable-text');
            editableTexts.forEach(text => {
                text.style.cursor = 'default';
            });
        });
        
        // Hide exit edit mode row
        this.editModeRow.style.display = 'none';
        
        console.log('Exited inline editing mode');
    }

    // Toggle between edit mode and archive mode
    toggleArchiveMode() {
        if (this.isArchiveMode) {
            this.exitArchiveMode();
        } else {
            this.enterArchiveMode();
        }
    }

    // Enter archive mode
    enterArchiveMode() {
        console.log('Entering archive mode...');
        
        // Exit edit mode if active
        if (this.isInlineEditingMode) {
            this.exitInlineEditingMode();
        }
        
        this.isArchiveMode = true;
        
        // Update button text and styling
        this.archiveFacultyBtn.textContent = 'Exit Archive Mode';
        this.archiveFacultyBtn.classList.remove('btn-outline-info', 'active');
        this.archiveFacultyBtn.classList.add('btn-outline-warning');
        
        // Show all archive buttons
        this.showAllArchiveButtons();
        
        console.log('Entered archive mode, isArchiveMode:', this.isArchiveMode);
    }

    // Exit archive mode
    exitArchiveMode() {
        console.log('Exiting archive mode...');
        
        this.isArchiveMode = false;
        
        // Update button text and styling
        this.archiveFacultyBtn.textContent = 'Archive Faculty';
        this.archiveFacultyBtn.classList.remove('btn-outline-warning');
        this.archiveFacultyBtn.classList.add('btn-outline-info', 'active');
        
        // Hide all archive buttons
        this.hideAllArchiveButtons();
        
        console.log('Exited archive mode');
    }

    // Show all archive buttons
    showAllArchiveButtons() {
        const archiveButtons = document.querySelectorAll('.archive-row-btn');
        const cancelArchiveButtons = document.querySelectorAll('.cancel-archive-btn');
        
        console.log('Found archive buttons:', archiveButtons.length);
        console.log('Found cancel archive buttons:', cancelArchiveButtons.length);
        
        archiveButtons.forEach((btn, index) => {
            btn.classList.remove('d-none');
            console.log(`Showed archive button ${index + 1}:`, btn);
        });
        
        cancelArchiveButtons.forEach((btn, index) => {
            btn.classList.remove('d-none');
            console.log(`Showed cancel archive button ${index + 1}:`, btn);
        });
        
        console.log('Showed all archive buttons');
    }

    // Hide all archive buttons
    hideAllArchiveButtons() {
        const archiveButtons = document.querySelectorAll('.archive-row-btn');
        const cancelArchiveButtons = document.querySelectorAll('.cancel-archive-btn');
        
        archiveButtons.forEach(btn => btn.classList.add('d-none'));
        cancelArchiveButtons.forEach(btn => btn.classList.add('d-none'));
        
        console.log('Hidden all archive buttons');
    }

    // Show all row action buttons
    showAllRowActionButtons() {
        const editButtons = document.querySelectorAll('.edit-row-btn');
        editButtons.forEach(btn => btn.classList.remove('d-none'));
        console.log('Showed all edit buttons');
    }

    // Hide all row action buttons
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

    // Make all cells editable
    makeAllCellsEditable() {
        const editableTexts = document.querySelectorAll('.editable-text');
        editableTexts.forEach(text => {
            text.style.cursor = 'pointer';
        });
        console.log('Made', editableTexts.length, 'cells clickable');
    }

    // Handle global click for inline editing
    handleGlobalClick(e) {
        const target = e.target;
        
        // If clicking on editable text, start editing
        if (target.classList.contains('editable-text')) {
            this.startEditing(target.closest('td'));
            return;
        }
        
        // If clicking on edit button, start row editing
        if (target.closest('.edit-row-btn')) {
            const editBtn = target.closest('.edit-row-btn');
            const facultyId = editBtn.dataset.facultyId;
            this.startEditingRow(facultyId);
            return;
        }

        // If clicking on archive button, archive faculty
        if (target.closest('.archive-row-btn')) {
            console.log('Archive button clicked!');
            const archiveBtn = target.closest('.archive-row-btn');
            const facultyId = archiveBtn.dataset.facultyId;
            console.log('Faculty ID to archive:', facultyId);
            this.archiveFaculty(facultyId);
            return;
        }

        // If clicking on cancel archive button, cancel archive
        if (target.closest('.cancel-archive-btn')) {
            const cancelBtn = target.closest('.cancel-archive-btn');
            const facultyId = cancelBtn.dataset.facultyId;
            this.cancelArchiveRow(facultyId);
            return;
        }
        
        // If clicking on save button, save row
        if (target.closest('.save-row-btn')) {
            const saveBtn = target.closest('.save-row-btn');
            const facultyId = saveBtn.dataset.facultyId;
            this.saveRow(facultyId);
            return;
        }
        
        // If clicking on cancel button, cancel row editing
        if (target.closest('.cancel-row-btn')) {
            const cancelBtn = target.closest('.cancel-row-btn');
            const facultyId = cancelBtn.dataset.facultyId;
            this.cancelEditingRow(facultyId);
            return;
        }
    }

    // Start editing a cell
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
            this.startEditingRow(cell.dataset.facultyId);
        }
        
        // Check if the row is now in editing mode
        if (!row.classList.contains('editing-row')) {
            console.log('Row is not in editing mode, returning');
            return;
        }
        
        const editableText = cell.querySelector('.editable-text');
        const editableInputs = cell.querySelectorAll('.editable-input');
        
        console.log('Found editableText:', editableText);
        console.log('Found editableInputs:', editableInputs);
        
        if (editableText && editableInputs.length > 0) {
            console.log('Hiding text, showing inputs');
            editableText.classList.add('d-none');
            editableInputs.forEach(input => {
                input.classList.remove('d-none');
            });
            
            // Focus on the first input
            editableInputs[0].focus();
            
            // Add escape key handling to all inputs
            editableInputs.forEach(input => {
                if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            this.cancelEditing(cell);
                        }
                    });
                }
            });
        } else {
            console.log('Missing editableText or editableInput elements');
        }
    }

    // Start editing a row
    startEditingRow(facultyId) {
        console.log('startEditingRow called for faculty ID:', facultyId);
        
        // Find the row by looking for the edit button with the matching faculty ID
        const editBtn = document.querySelector(`.edit-row-btn[data-faculty-id="${facultyId}"]`);
        if (!editBtn) {
            console.log('No edit button found for faculty ID:', facultyId);
            return;
        }
        
        const row = editBtn.closest('tr');
        if (!row) {
            console.log('No row found for faculty ID:', facultyId);
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
        
        // Make all editable cells in this row clickable
        const editableTexts = row.querySelectorAll('.editable-text');
        editableTexts.forEach(text => {
            text.style.cursor = 'pointer';
        });
        
        console.log('Made', editableTexts.length, 'cells clickable');
    }

    // Save a row
    saveRow(facultyId) {
        console.log('saveRow called for faculty ID:', facultyId);
        
        // Find the row by looking for the edit button with the matching faculty ID
        const editBtn = document.querySelector(`.edit-row-btn[data-faculty-id="${facultyId}"]`);
        if (!editBtn) {
            console.log('No edit button found for faculty ID:', facultyId);
            return;
        }
        
        const row = editBtn.closest('tr');
        if (!row) {
            console.log('No row found for faculty ID:', facultyId);
            return;
        }
        
        console.log('Found row for saving:', row);
        
        // Collect all changed values from the row
        const changes = {};
        const editableInputs = row.querySelectorAll('.editable-input');
        
        console.log('Found', editableInputs.length, 'editable inputs');
        
        editableInputs.forEach(input => {
            const field = input.dataset.field;
            if (field && input.value.trim() !== '') {
                changes[field] = input.value;
                console.log('Adding field to changes:', field, '=', input.value);
            } else if (field && input.value.trim() === '') {
                console.log('Skipping empty field:', field);
            }
        });
        
        console.log('Changes to save:', changes);
        
        // Update display text for first_name and last_name fields
        if (changes.first_name) {
            const firstNameCell = row.querySelector('[data-field="first_name"]');
            if (firstNameCell) {
                const editableText = firstNameCell.querySelector('.editable-text');
                if (editableText) {
                    editableText.textContent = changes.first_name;
                }
            }
        }
        
        if (changes.last_name) {
            const lastNameCell = row.querySelector('[data-field="last_name"]');
            if (lastNameCell) {
                const editableText = lastNameCell.querySelector('.editable-text');
                if (editableText) {
                    editableText.textContent = changes.last_name;
                }
            }
        }
        
        // Update display text for other fields
        Object.keys(changes).forEach(field => {
            if (field !== 'first_name' && field !== 'last_name') {
                const cell = row.querySelector(`[data-field="${field}"]`);
                if (cell) {
                    const editableText = cell.querySelector('.editable-text');
                    const editableInput = cell.querySelector('.editable-input');
                    
                    if (editableText && editableInput) {
                        let newValue = editableInput.value;
                        
                        // Update badge styling for certain fields
                        if (field === 'gender') {
                            editableText.className = 'editable-text badge bg-secondary';
                        } else if (field === 'department_id') {
                            editableText.className = 'editable-text badge bg-primary';
                            // Update department name display
                            const departmentSelect = editableInput;
                            const selectedOption = departmentSelect.querySelector('option:checked');
                            newValue = selectedOption ? selectedOption.textContent : 'Unassigned';
                        }
                        
                        editableText.textContent = newValue;
                    }
                }
            }
        });
        
        // Save all changes to backend
        this.saveRowToBackend(facultyId, changes);
        
        // Reset buttons and remove glowing effect
        this.resetRowButtons(row);
        
        // Cancel all editing in the row after saving
        const editableInputs2 = row.querySelectorAll('.editable-input');
        editableInputs2.forEach(input => {
            const cell = input.closest('td');
            this.cancelEditing(cell);
        });
    }

    // Cancel editing a cell
    cancelEditing(cell) {
        const editableText = cell.querySelector('.editable-text');
        const editableInputs = cell.querySelectorAll('.editable-input');
        
        if (editableText && editableInputs.length > 0) {
            editableText.classList.remove('d-none');
            editableInputs.forEach(input => {
                input.classList.add('d-none');
            });
        }
    }

    // Cancel editing a row
    cancelEditingRow(facultyId) {
        console.log('cancelEditingRow called for faculty ID:', facultyId);
        
        // Find the row by looking for the edit button with the matching faculty ID
        const editBtn = document.querySelector(`.edit-row-btn[data-faculty-id="${facultyId}"]`);
        if (!editBtn) {
            console.log('No edit button found for faculty ID:', facultyId);
            return;
        }
        
        const row = editBtn.closest('tr');
        if (!row) {
            console.log('No row found for faculty ID:', facultyId);
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

    // Reset row buttons
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

    // Save row to backend
    async saveRowToBackend(facultyId, changes) {
        try {
            const response = await fetch(`/faculty/${facultyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(changes)
            });

            if (response.ok) {
                this.showNotification('Faculty updated successfully!', 'success');
                
                // Refresh the page after successful save
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Wait 1 second for the notification to be visible
            } else {
                this.showNotification('Error updating faculty', 'error');
            }
        } catch (error) {
            console.error('Error saving row:', error);
            this.showNotification('Error updating faculty', 'error');
        }
    }

    // Archive faculty member
    async archiveFaculty(facultyId) {
        if (!confirm('Are you sure you want to archive this faculty member?')) {
            return;
        }

        try {
            const response = await fetch(`/faculty/${facultyId}/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                this.showNotification('Faculty archived successfully!', 'success');
                
                // Remove the row from the table
                const row = document.querySelector(`tr[data-faculty-id="${facultyId}"]`);
                if (row) {
                    row.remove();
                }
                
                // Refresh the page after successful archive
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showNotification('Error archiving faculty', 'error');
            }
        } catch (error) {
            console.error('Error archiving faculty:', error);
            this.showNotification('Error archiving faculty', 'error');
        }
    }

    // Cancel archive row
    cancelArchiveRow(facultyId) {
        const row = document.querySelector(`tr[data-faculty-id="${facultyId}"]`);
        if (!row) {
            console.log('No row found for faculty ID:', facultyId);
            return;
        }

        console.log('Canceling archive for row:', row);
        
        // Hide archive buttons for this row
        const archiveBtn = row.querySelector('.archive-row-btn');
        const cancelArchiveBtn = row.querySelector('.cancel-archive-btn');
        
        if (archiveBtn && cancelArchiveBtn) {
            archiveBtn.classList.add('d-none');
            cancelArchiveBtn.classList.add('d-none');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize faculty page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.facultyPage = new FacultyPage();
});
