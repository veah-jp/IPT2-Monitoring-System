// Account Management JavaScript
class AccountPage {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('AccountPage: Initializing...');
        this.bindEvents();
        this.loadUserData();
        this.addEntranceAnimations();
        console.log('AccountPage: Initialized successfully');
    }

    bindEvents() {
        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Change password form submission
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handlePasswordChange(e));
        }

        // Tab navigation
        const tabButtons = document.querySelectorAll('.account-tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Form field validation
        this.setupFormValidation();
    }

    async loadUserData() {
        try {
            // Get current user data from the page (embedded in HTML)
            const userDataElement = document.getElementById('currentUserData');
            if (userDataElement) {
                this.currentUser = JSON.parse(userDataElement.textContent);
                this.populateProfileForm();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Error loading user data', 'error');
        }
    }

    populateProfileForm() {
        if (!this.currentUser) return;

        // Populate profile form fields
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        const emailField = document.getElementById('email');
        const usernameField = document.getElementById('username');

        if (firstNameField) firstNameField.value = this.currentUser.first_name || '';
        if (lastNameField) lastNameField.value = this.currentUser.last_name || '';
        if (emailField) emailField.value = this.currentUser.email || '';
        if (usernameField) usernameField.value = this.currentUser.username || '';
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const form = e.target;
        
        try {
            const formData = new FormData(form);
            
            // Convert FormData to JSON
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Validation
            if (!this.validateProfileData(data)) {
                return;
            }

            // Show loading state
            this.showLoadingState(form, true);

            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Profile updated successfully!', 'success');
                // Refresh the page after a short delay to show updated information
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showNotification(result.message || 'Error updating profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Error updating profile', 'error');
        } finally {
            this.showLoadingState(form, false);
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        
        try {
            const form = document.getElementById('changePasswordForm');
            const formData = new FormData(form);
            
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Validation
            if (!this.validatePasswordData(data)) {
                return;
            }

            // Show loading state
            this.showLoadingState(form, true);

            const response = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification('Password changed successfully!', 'success');
                // Refresh the page after a short delay to show updated information
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showNotification(result.message || 'Error changing password', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showNotification('Error changing password', 'error');
        } finally {
            this.showLoadingState(form, false);
        }
    }

    validateProfileData(data) {
        // First name validation
        if (data.first_name && data.first_name.trim().length < 2) {
            this.showNotification('First name must be at least 2 characters long', 'error');
            return false;
        }

        // Last name validation
        if (data.last_name && data.last_name.trim().length < 2) {
            this.showNotification('Last name must be at least 2 characters long', 'error');
            return false;
        }

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    validatePasswordData(data) {
        // Current password validation
        if (!data.current_password || data.current_password.trim().length < 6) {
            this.showNotification('Current password is required', 'error');
            return false;
        }

        // New password validation
        if (!data.new_password || data.new_password.trim().length < 6) {
            this.showNotification('New password must be at least 6 characters long', 'error');
            return false;
        }

        // Confirm password validation
        if (data.new_password !== data.confirm_password) {
            this.showNotification('New passwords do not match', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    switchTab(e) {
        e.preventDefault();
        
        const targetTab = e.currentTarget.dataset.tab;
        const tabButtons = document.querySelectorAll('.account-tab-btn');
        const tabContents = document.querySelectorAll('.account-tab-content');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button
        e.currentTarget.classList.add('active');

        // Show corresponding content
        const targetContent = document.getElementById(`${targetTab}Tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    updateDisplayedUserInfo() {
        // Update displayed user information in the header or sidebar
        const userNameElements = document.querySelectorAll('.user-name, .profile-name');
        const fullName = this.getFullName();
        
        userNameElements.forEach(element => {
            element.textContent = fullName || this.currentUser.username;
        });
    }

    getFullName() {
        if (this.currentUser.first_name && this.currentUser.last_name) {
            return `${this.currentUser.first_name} ${this.currentUser.last_name}`;
        } else if (this.currentUser.first_name) {
            return this.currentUser.first_name;
        } else if (this.currentUser.last_name) {
            return this.currentUser.last_name;
        }
        return null;
    }

    showLoadingState(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.dataset.originalText || 'Update Profile';
            }
        }
    }

    setupFormValidation() {
        // Real-time validation for form fields
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remove existing error styling
        this.clearFieldError(field);
        
        // Validate based on field type
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'first_name':
            case 'last_name':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Must be at least 2 characters long';
                }
                break;
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Create or update error message
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Add show class for animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    addEntranceAnimations() {
        const elements = document.querySelectorAll('.account-card, .form-group');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in');
            }, index * 100);
        });
    }
}

// Initialize account page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.accountPage = new AccountPage();
});
