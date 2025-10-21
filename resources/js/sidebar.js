// Sidebar JavaScript
class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupResponsiveBehavior();
    }

    bindEvents() {
        // Sidebar toggle
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Profile dropdown
        const profileButton = document.getElementById('profile-menu-button');
        const profileDropdown = document.getElementById('profile-dropdown-menu');
        
        if (profileButton && profileDropdown) {
            profileButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleProfileDropdown();
            });
        }

        // Close profile dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                this.closeProfileDropdown();
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.sidebar?.classList.contains('mobile')) {
                if (!e.target.closest('#sidebar') && !e.target.closest('#sidebarToggle')) {
                    this.closeSidebar();
                }
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
                this.closeProfileDropdown();
            }
        });
    }

    toggleSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.toggle('collapsed');
        }
    }

    openSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('collapsed');
        }
    }

    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.add('collapsed');
        }
    }

    toggleProfileDropdown() {
        const profileDropdown = document.getElementById('profile-dropdown-menu');
        if (profileDropdown) {
            profileDropdown.classList.toggle('show');
        }
    }

    closeProfileDropdown() {
        const profileDropdown = document.getElementById('profile-dropdown-menu');
        if (profileDropdown) {
            profileDropdown.classList.remove('show');
        }
    }

    setupResponsiveBehavior() {
        // Handle mobile sidebar
        if (window.innerWidth <= 768) {
            this.sidebar?.classList.add('mobile');
        }
        
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.sidebar?.classList.add('mobile');
            } else {
                this.sidebar?.classList.remove('mobile');
            }
        });
    }

    // Navigation methods
    showDashboard() {
        // Dashboard is already visible, just refresh data if needed
        if (window.dashboard) {
            window.dashboard.refreshDashboardData();
        }
    }

    showStudents() {
        window.location.href = '/students';
    }

    showFaculty() {
        window.location.href = '/faculty';
    }

    showReports() {
        // Placeholder for reports page
        console.log('Reports page - to be implemented');
    }

    showSettings() {
        window.location.href = '/settings';
    }

    showAccount() {
        window.location.href = '/account';
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sidebar = new Sidebar();
});
