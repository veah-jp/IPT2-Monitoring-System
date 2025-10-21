// Login Page JavaScript
class LoginPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupParallaxEffects();
    }

    setupEventListeners() {
        // Profile icon rotation
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', () => this.rotateIcon());
        }

        // Form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Forgot password link
        const forgotLink = document.querySelector('.forgot-link a');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotMessage();
            });
        }

        // Login button ripple effect
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => this.createRippleEffect(e));
        }

        // Input focus effects
        this.setupInputEffects();
    }

    setupInputEffects() {
        const inputs = document.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                this.handleInputFocus(e.target);
            });
            
            input.addEventListener('blur', (e) => {
                this.handleInputBlur(e.target);
            });

            // Add floating label effect
            input.addEventListener('input', (e) => {
                this.handleInputChange(e.target);
            });
        });
    }

    handleInputFocus(input) {
        const container = input.parentElement;
        container.style.transform = 'scale(1.02)';
        
        // Add focus animation
        input.style.animation = 'inputFocus 0.3s ease forwards';
    }

    handleInputBlur(input) {
        const container = input.parentElement;
        container.style.transform = 'scale(1)';
        
        // Remove focus animation
        input.style.animation = 'inputBlur 0.3s ease forwards';
    }

    handleInputChange(input) {
        if (input.value.length > 0) {
            input.classList.add('has-content');
        } else {
            input.classList.remove('has-content');
        }
    }

    rotateIcon() {
        const icon = document.querySelector('.profile-icon');
        if (!icon) return;

        icon.style.transform = 'rotateY(360deg) scale(1.1)';
        
        setTimeout(() => {
            icon.style.transform = 'rotateY(0deg) scale(1)';
        }, 1000);
    }

    showForgotMessage() {
        // Create a custom modal instead of alert
        this.createCustomModal(
            'Password Reset',
            'Please contact your system administrator to reset your credentials.',
            'info'
        );
    }

    createCustomModal(title, message, type = 'info') {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-ok">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        this.addModalStyles();

        // Setup modal events
        const closeBtn = modal.querySelector('.modal-close');
        const okBtn = modal.querySelector('.btn-ok');
        const overlay = modal.querySelector('.modal-overlay');

        [closeBtn, okBtn, overlay].forEach(element => {
            element.addEventListener('click', () => {
                modal.remove();
            });
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .custom-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }

            .modal-content {
                position: relative;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 0;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                animation: modalScaleIn 0.3s ease forwards;
            }

            .modal-header {
                padding: 20px 25px 15px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }

            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .modal-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #333;
            }

            .modal-body {
                padding: 20px 25px;
            }

            .modal-body p {
                margin: 0;
                color: #555;
                line-height: 1.5;
            }

            .modal-footer {
                padding: 15px 25px 20px;
                text-align: right;
            }

            .btn-ok {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 10px 25px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .btn-ok:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }

            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes modalScaleIn {
                to { transform: scale(1); }
            }
        `;

        document.head.appendChild(style);
    }

    handleFormSubmission(e) {
        const btn = document.getElementById('loginBtn');
        if (!btn) return;

        // Add loading state
        btn.classList.add('loading');
        btn.textContent = 'LOGGING IN...';
        btn.disabled = true;
        
        // Re-enable after 5 seconds if form doesn't submit
        setTimeout(() => {
            if (btn.classList.contains('loading')) {
                btn.classList.remove('loading');
                btn.textContent = 'LOGIN';
                btn.disabled = false;
            }
        }, 5000);
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initializeAnimations() {
        // Add entrance animations to elements
        const elements = document.querySelectorAll('.login-container > *');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.animation = `slideInUp 0.6s ease ${index * 0.1}s forwards`;
        });

        // Add keyframes for entrance animation
        this.addEntranceKeyframes();
    }

    addEntranceKeyframes() {
        if (document.getElementById('entrance-keyframes')) return;

        const style = document.createElement('style');
        style.id = 'entrance-keyframes';
        style.textContent = `
            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes inputFocus {
                to {
                    border-color: #667eea;
                    box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
                }
            }

            @keyframes inputBlur {
                to {
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    setupParallaxEffects() {
        // Add parallax effect to background elements
        document.addEventListener('mousemove', (e) => {
            const circles = document.querySelectorAll('.floating-circle');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            circles.forEach((circle, index) => {
                const speed = (index + 1) * 0.5;
                circle.style.transform = `translate(${x * speed * 20}px, ${y * speed * 20}px)`;
            });
        });

        // Add scroll parallax effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-circle');
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Utility method to show success message
    showSuccessMessage(message) {
        this.createCustomModal('Success', message, 'success');
    }

    // Utility method to show error message
    showErrorMessage(message) {
        this.createCustomModal('Error', message, 'error');
    }

    // Method to reset form
    resetForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
            
            // Remove any validation classes
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }
    }

    // Method to validate form
    validateForm() {
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        let isValid = true;

        // Reset previous validation states
        [username, password].forEach(input => {
            input.classList.remove('is-invalid');
        });

        // Validate username
        if (!username.value.trim()) {
            username.classList.add('is-invalid');
            isValid = false;
        }

        // Validate password
        if (!password.value.trim()) {
            password.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
}

// Initialize the login page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginPage();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginPage;
}
