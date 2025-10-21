class SettingsPage {
    constructor() {
        this.init();
    }

    init() {
        console.log('SettingsPage: Initializing...');
        this.bindEvents();
        this.showContent('courseContent', null); // Show first tab by default
        console.log('SettingsPage: Initialized successfully');
    }

    bindEvents() {
        console.log('SettingsPage: Binding events...');
        
        // Bind tab click events using event delegation
        document.addEventListener('click', (e) => {
            const tab = e.target.closest('.settings-tab');
            if (tab) {
                const contentId = tab.getAttribute('data-content');
                if (contentId) {
                    this.showContent(contentId, e);
                }
            }
        });
        
        console.log('SettingsPage: Events bound successfully');
    }

    showContent(contentId, event) {
        console.log('SettingsPage: Showing content:', contentId);
        
        // Hide all content sections first
        this.hideAllContent();
        
        // Remove active class from all tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to the clicked tab
        if (event && event.target) {
            const clickedTab = event.target.closest('.settings-tab');
            if (clickedTab) {
                clickedTab.classList.add('active');
            }
        } else {
            // If no event or no target, find the tab by data-content attribute
            const tab = document.querySelector(`[data-content="${contentId}"]`);
            if (tab) {
                tab.classList.add('active');
            }
        }
        
        // Show the requested content section
        const contentSection = document.getElementById(contentId);
        if (contentSection) {
            contentSection.style.display = 'block';
            console.log('SettingsPage: Content shown:', contentId);
            
            // Initialize the appropriate module if it hasn't been initialized yet
            this.initializeModule(contentId);
        } else {
            console.error('SettingsPage: Content section not found:', contentId);
        }
    }

    hideAllContent() {
        // Hide all content sections
        const contentSections = [
            'courseContent', 'departmentContent', 'studentArchivesContent', 'facultyArchivesContent'
        ];
        
        contentSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
        
        console.log('SettingsPage: All content sections hidden');
    }
    
    initializeModule(contentId) {
        switch (contentId) {
            case 'courseContent':
                if (!window.courseManagement && typeof CourseManagement !== 'undefined') {
                    console.log('SettingsPage: Initializing CourseManagement module...');
                    window.courseManagement = new CourseManagement();
                } else if (typeof CourseManagement === 'undefined') {
                    console.error('SettingsPage: CourseManagement class not found');
                }
                break;
            case 'departmentContent':
                if (!window.departmentManagement && typeof DepartmentManagement !== 'undefined') {
                    console.log('SettingsPage: Initializing DepartmentManagement module...');
                    window.departmentManagement = new DepartmentManagement();
                } else if (typeof DepartmentManagement === 'undefined') {
                    console.error('SettingsPage: DepartmentManagement class not found');
                }
                break;
            case 'studentArchivesContent':
                if (!window.studentArchives && typeof StudentArchives !== 'undefined') {
                    console.log('SettingsPage: Initializing StudentArchives module...');
                    window.studentArchives = new StudentArchives();
                } else if (typeof StudentArchives === 'undefined') {
                    console.error('SettingsPage: StudentArchives class not found');
                }
                break;
            case 'facultyArchivesContent':
                if (!window.facultyArchives && typeof FacultyArchives !== 'undefined') {
                    console.log('SettingsPage: Initializing FacultyArchives module...');
                    window.facultyArchives = new FacultyArchives();
                } else if (typeof FacultyArchives === 'undefined') {
                    console.error('SettingsPage: FacultyArchives class not found');
                }
                break;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing SettingsPage...');
    window.settingsPage = new SettingsPage();
});
