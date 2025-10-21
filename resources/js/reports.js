// Reports Module JavaScript
class ReportsPage {
    constructor() {
        this.currentData = null;
        this.charts = {};
        this.filters = {
            dateRange: 'all',
            department: 'all',
            course: 'all',
            status: 'all'
        };
        // Maps for quick lookup
        this.coursesByDepartmentId = new Map();
        // Student report specific filters (UI-level)
        this.studentReportFilters = { department: 'all', course: 'all' };
        this.init();
    }

    init() {
        console.log('ReportsPage: Initializing...');
        this.bindEvents();
        this.loadInitialData();
        this.setupCharts();
        console.log('ReportsPage: Initialized successfully');
    }

    bindEvents() {
        // Filter controls
        const dateRangeSelect = document.getElementById('dateRangeFilter');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => this.handleFilterChange('dateRange', e.target.value));
        }

        const departmentSelect = document.getElementById('departmentFilter');
        if (departmentSelect) {
            departmentSelect.addEventListener('change', (e) => this.handleFilterChange('department', e.target.value));
        }

        const courseSelect = document.getElementById('courseFilter');
        if (courseSelect) {
            courseSelect.addEventListener('change', (e) => this.handleFilterChange('course', e.target.value));
        }

        const statusSelect = document.getElementById('statusFilter');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => this.handleFilterChange('status', e.target.value));
        }

        // Department filter for student report
        const departmentFilterReport = document.getElementById('departmentFilterReport');
        if (departmentFilterReport) {
            departmentFilterReport.addEventListener('change', (e) => this.handleStudentReportFilter(e.target.value));
        }

        // Export buttons
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => this.exportToPDF());
        }

        const exportExcelBtn = document.getElementById('exportExcelBtn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.exportToExcel());
        }

        const exportCsvBtn = document.getElementById('exportCsvBtn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => this.exportToCSV());
        }

        // Student report specific buttons
        const printReportBtn = document.getElementById('printReportBtn');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', () => this.printStudentReport());
        }

        const exportReportBtn = document.getElementById('exportReportBtn');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => this.exportStudentReportToPDF());
        }

        // Report type tabs
        const reportTabs = document.querySelectorAll('.report-tab-btn');
        reportTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchReportType(e));
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshReportsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshReports());
        }
    }

    async loadInitialData() {
        try {
            this.showLoadingState(true);
            
            // Load departments and courses for filters
            await this.loadFilterOptions();
            
            // Load initial report data
            await this.loadReportData();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showNotification('Error loading report data', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    async loadFilterOptions() {
        try {
            const [deptResponse, courseResponse] = await Promise.all([
                fetch('/api/departments'),
                fetch('/api/courses')
            ]);

            let departments = [];
            let courses = [];

            if (deptResponse.ok) {
                departments = await deptResponse.json();
                this.populateDepartmentFilter(departments);
            }
            if (courseResponse.ok) {
                courses = await courseResponse.json();
                this.populateCourseFilter(courses);
            }

            // Build coursesByDepartment map
            this.coursesByDepartmentId.clear();
            courses.filter(c => c && c.is_active !== 0).forEach(course => {
                const deptId = course.department_id || (course.department && course.department.department_id);
                if (!deptId) return;
                if (!this.coursesByDepartmentId.has(deptId)) {
                    this.coursesByDepartmentId.set(deptId, []);
                }
                this.coursesByDepartmentId.get(deptId).push(course);
            });

            // Initialize Student Report filters (Department -> Course)
            this.setupStudentReportFilters(departments, courses);

        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    }

    populateDepartmentFilter(departments) {
        const departmentSelect = document.getElementById('departmentFilter');
        if (!departmentSelect) return;

        // Clear existing options
        departmentSelect.innerHTML = '<option value="all">All Departments</option>';
        
        departments.forEach(dept => {
            if (dept.is_active !== 0) {
                const option = document.createElement('option');
                option.value = dept.department_id;
                option.textContent = dept.department_name;
                departmentSelect.appendChild(option);
            }
        });
    }

    populateCourseFilter(courses) {
        const courseSelect = document.getElementById('courseFilter');
        if (courseSelect) {
            // Clear existing options
            courseSelect.innerHTML = '<option value="all">All Courses</option>';
            
                    courses.forEach(course => {
            if (course.is_active !== 0) {
                const option = document.createElement('option');
                option.value = course.course_id;
                option.textContent = course.course_name;
                courseSelect.appendChild(option);
            }
        });
        }
    }

    setupStudentReportFilters(departments, courses) {
        // Department select for Student Report
        const deptSelect = document.getElementById('departmentFilterReport');
        if (deptSelect) {
            // Populate departments (active only)
            deptSelect.innerHTML = '<option value="all">All Departments</option>';
            (departments || []).forEach(dept => {
                if (dept && dept.is_active !== 0) {
                    const opt = document.createElement('option');
                    opt.value = String(dept.department_id);
                    opt.textContent = dept.department_name;
                    deptSelect.appendChild(opt);
                }
            });
        }

        // Create Course select for Student Report if missing
        let courseSelect = document.getElementById('courseFilterReport');
        if (!courseSelect && deptSelect) {
            // Insert a sibling column with label+select
            const wrapper = document.createElement('div');
            wrapper.className = 'col-md-4';
            wrapper.innerHTML = '<label for="courseFilterReport" class="form-label"><strong>Filter by Course:</strong></label>\n<select class="form-select" id="courseFilterReport"><option value="all">All Courses</option></select>';
            // Try to place next to the department filter
            const deptCol = deptSelect.closest('.col-md-4');
            if (deptCol && deptCol.parentNode) {
                deptCol.parentNode.insertBefore(wrapper, deptCol.nextSibling);
            } else {
                // Fallback: insert after the department select
                deptSelect.insertAdjacentElement('afterend', wrapper);
            }
            courseSelect = wrapper.querySelector('#courseFilterReport');
        }

        // Populate course options based on current department selection
        const populateStudentReportCourses = () => {
            if (!courseSelect) return;
            const selectedDeptId = (deptSelect && deptSelect.value) ? deptSelect.value : 'all';
            courseSelect.innerHTML = '<option value="all">All Courses</option>';
            if (selectedDeptId !== 'all') {
                const list = this.coursesByDepartmentId.get(Number(selectedDeptId)) || [];
                list.forEach(course => {
                    const opt = document.createElement('option');
                    opt.value = String(course.course_id);
                    opt.textContent = course.course_name;
                    courseSelect.appendChild(opt);
                });
            }
        };

        populateStudentReportCourses();

        // Wire events
        if (deptSelect) {
            deptSelect.addEventListener('change', async (e) => {
                this.studentReportFilters.department = e.target.value;
                // Update course list for chosen department
                populateStudentReportCourses();
                // Load server-filtered data by department, then apply course filter client-side
                await this.handleStudentReportFilter(e.target.value);
                // After server returns, apply course filter
                this.applyStudentCourseFilter();
            });
        }
        if (courseSelect) {
            courseSelect.addEventListener('change', () => {
                this.studentReportFilters.course = courseSelect.value;
                this.applyStudentCourseFilter();
            });
        }
    }

    async loadReportData() {
        try {
            console.log('Loading report data...');
            const response = await fetch('/api/reports/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(this.filters)
            });

            console.log('Response status:', response.status);
            if (response.ok) {
                this.currentData = await response.json();
                console.log('Report data loaded:', this.currentData);
                this.updateReportsDisplay();
                this.updateStatistics();
            } else {
                const errorText = await response.text();
                console.error('Response not ok:', errorText);
                throw new Error('Failed to load report data: ' + response.status);
            }
        } catch (error) {
            console.error('Error loading report data:', error);
            this.showNotification('Error loading report data: ' + error.message, 'error');
        }
    }

    updateReportsDisplay() {
        if (!this.currentData) return;

        // Update summary cards
        this.updateSummaryCards();
        
        // Update detailed tables
        this.updateDetailedTables();
        
        // Update statistics
        this.updateStatistics();
    }

    updateSummaryCards() {
        const { summary } = this.currentData;
        if (!summary) return;

        // Update total students
        const totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) {
            totalStudentsEl.textContent = summary.total_students || 0;
        }

        // Update total faculty
        const totalFacultyEl = document.getElementById('totalFaculty');
        if (totalFacultyEl) {
            totalFacultyEl.textContent = summary.total_faculty || 0;
        }

        // Update total courses
        const totalCoursesEl = document.getElementById('totalCourses');
        if (totalCoursesEl) {
            totalCoursesEl.textContent = summary.total_courses || 0;
        }

        // Update total departments
        const totalDepartmentsEl = document.getElementById('totalDepartments');
        if (totalDepartmentsEl) {
            totalDepartmentsEl.textContent = summary.total_departments || 0;
        }

        // Update enrollment rate
        const enrollmentRateEl = document.getElementById('enrollmentRate');
        if (enrollmentRateEl) {
            const rate = summary.enrollment_rate || 0;
            enrollmentRateEl.textContent = `${rate.toFixed(1)}%`;
        }
    }

    updateDetailedTables() {
        const { details } = this.currentData;
        if (!details) return;

        // Update student table
        if (details.students) {
            this.populateStudentTable(details.students);
        }

        // Update faculty table
        if (details.faculty) {
            this.populateFacultyTable(details.faculty);
        }

        // Update enrollment table
        if (details.enrollments) {
            this.populateEnrollmentTable(details.enrollments);
        }
    }

    populateStudentTable(students) {
        const tableBody = document.getElementById('studentTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.student_id}</td>
                <td>${student.first_name} ${student.last_name}</td>
                <td>${student.department_name || 'N/A'}</td>
                <td>${student.course_name || 'N/A'}</td>
                <td>${student.enrollment_date || 'N/A'}</td>
                <td><span class="badge ${student.is_active ? 'bg-success' : 'bg-secondary'}">${student.is_active ? 'Active' : 'Inactive'}</span></td>
            `;
            tableBody.appendChild(row);
        });

        // Also populate the student report table
        this.populateStudentReportTable(students);
    }

    populateStudentReportTable(students) {
        const reportTableBody = document.getElementById('studentReportTableBody');
        if (!reportTableBody) return;

        reportTableBody.innerHTML = '';
        
        if (!students || students.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center text-muted">No students found</td>';
            reportTableBody.appendChild(row);
            return;
        }

        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;">${index + 1}</td>
                <td>${student.name || 'N/A'}</td>
                <td style="text-align: center;">${student.age || 'N/A'}</td>
                <td style="text-align: center;">${student.gender || 'N/A'}</td>
                <td>${student.contact_number || 'N/A'}</td>
                <td>${student.email_address || 'N/A'}</td>
            `;
            reportTableBody.appendChild(row);
        });

        // Update report info
        const reportTotalStudents = document.getElementById('reportTotalStudents');
        if (reportTotalStudents) {
            reportTotalStudents.textContent = `Total Students: ${students.length}`;
        }
        // Update course info (optional)
        const reportDepartmentInfo = document.getElementById('reportDepartmentInfo');
        if (reportDepartmentInfo) {
            const deptSelect = document.getElementById('departmentFilterReport');
            const deptText = (deptSelect && deptSelect.options[deptSelect.selectedIndex]) ? deptSelect.options[deptSelect.selectedIndex].text : 'All Departments';
            reportDepartmentInfo.textContent = `Department: ${deptText}`;
        }
    }

    applyStudentCourseFilter() {
        try {
            if (!this.currentData || !this.currentData.details || !Array.isArray(this.currentData.details.students)) return;
            const allStudents = this.currentData.details.students;
            const courseSelect = document.getElementById('courseFilterReport');
            const selectedCourseId = courseSelect ? courseSelect.value : 'all';
            const deptSelect = document.getElementById('departmentFilterReport');
            const selectedDeptText = (deptSelect && deptSelect.value !== 'all') ? (deptSelect.options[deptSelect.selectedIndex].text) : null;

            let filtered = allStudents.slice();
            // Ensure department constraint as a safety (server already filters by department)
            if (selectedDeptText) {
                filtered = filtered.filter(s => (s.department_name === selectedDeptText));
            }
            // Apply course constraint by matching course_name
            if (selectedCourseId !== 'all') {
                const courseText = courseSelect.options[courseSelect.selectedIndex].text;
                filtered = filtered.filter(s => (s.course_name === courseText));
            }
            this.populateStudentReportTable(filtered);
        } catch (error) {
            console.error('Error applying student course filter:', error);
        }
    }

    populateFacultyTable(faculty) {
        const tableBody = document.getElementById('facultyTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        faculty.forEach(facultyMember => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${facultyMember.faculty_id}</td>
                <td>${facultyMember.first_name} ${facultyMember.last_name}</td>
                <td>${facultyMember.department_name || 'N/A'}</td>
                <td>${facultyMember.specialization || 'N/A'}</td>
                <td>${facultyMember.hire_date || 'N/A'}</td>
                <td><span class="badge ${facultyMember.is_active ? 'bg-success' : 'bg-secondary'}">${facultyMember.is_active ? 'Active' : 'Inactive'}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    populateEnrollmentTable(enrollments) {
        const tableBody = document.getElementById('enrollmentTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        enrollments.forEach(enrollment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${enrollment.enrollment_id}</td>
                <td>${enrollment.student_name}</td>
                <td>${enrollment.course_name}</td>
                <td>${enrollment.department_name}</td>
                <td>${enrollment.enrollment_date}</td>
                <td><span class="badge bg-success">Active</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    updateStatistics() {
        const { statistics } = this.currentData;
        if (!statistics) return;

        // Update department distribution
        if (statistics.department_distribution) {
            this.updateDepartmentChart(statistics.department_distribution);
        }

        // Update course enrollment
        if (statistics.course_enrollment) {
            this.updateCourseEnrollmentChart(statistics.course_enrollment);
        }

        // Update student growth
        if (statistics.student_growth) {
            this.updateStudentGrowthChart(statistics.student_growth);
        }
    }

    setupCharts() {
        // Initialize Chart.js if available
        if (typeof Chart !== 'undefined') {
            this.initializeCharts();
        } else {
            console.warn('Chart.js not available. Charts will not be displayed.');
        }
    }

    initializeCharts() {
        // Department distribution chart
        const deptCtx = document.getElementById('departmentChart');
        if (deptCtx) {
            this.charts.department = new Chart(deptCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Course enrollment chart
        const courseCtx = document.getElementById('courseEnrollmentChart');
        if (courseCtx) {
            this.charts.course = new Chart(courseCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Enrollment Count',
                        data: [],
                        backgroundColor: '#36A2EB'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Student growth chart
        const growthCtx = document.getElementById('studentGrowthChart');
        if (growthCtx) {
            this.charts.growth = new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Total Students',
                        data: [],
                        borderColor: '#4BC0C0',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    updateDepartmentChart(data) {
        if (!this.charts.department) return;

        this.charts.department.data.labels = data.map(item => item.department_name);
        this.charts.department.data.datasets[0].data = data.map(item => item.student_count);
        this.charts.department.update();
    }

    updateCourseEnrollmentChart(data) {
        if (!this.charts.course) return;

        this.charts.course.data.labels = data.map(item => item.course_name);
        this.charts.course.data.datasets[0].data = data.map(item => item.enrollment_count);
        this.charts.course.update();
    }

    updateStudentGrowthChart(data) {
        if (!this.charts.growth) return;

        this.charts.growth.data.labels = data.map(item => item.month);
        this.charts.growth.data.datasets[0].data = data.map(item => item.total_students);
        this.charts.growth.update();
    }

    handleFilterChange(filterType, value) {
        this.filters[filterType] = value;
        this.applyFilters();
    }

    async applyFilters() {
        try {
            this.showLoadingState(true);
            await this.loadReportData();
        } catch (error) {
            console.error('Error applying filters:', error);
            this.showNotification('Error applying filters', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    async handleStudentReportFilter(departmentId) {
        try {
            this.showLoadingState(true);
            
            // Update the department filter in filters object
            const tempFilters = { ...this.filters, department: departmentId };
            
            const response = await fetch('/api/reports/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(tempFilters)
            });

            if (response.ok) {
                const data = await response.json();
                this.populateStudentReportTable(data.details.students);
                
                // Update department info in report header
                const reportDepartmentInfo = document.getElementById('reportDepartmentInfo');
                if (reportDepartmentInfo) {
                    const departmentSelect = document.getElementById('departmentFilterReport');
                    const selectedDepartment = departmentSelect.options[departmentSelect.selectedIndex].text;
                    reportDepartmentInfo.textContent = `Department: ${selectedDepartment}`;
                }
                
                this.showNotification('Student report updated successfully', 'success');
            } else {
                throw new Error('Failed to load filtered student data');
            }
        } catch (error) {
            console.error('Error filtering student report:', error);
            this.showNotification('Error filtering student report: ' + error.message, 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    printStudentReport() {
        try {
            window.print();
        } catch (error) {
            console.error('Error printing report:', error);
            this.showNotification('Error printing report', 'error');
        }
    }

    async exportStudentReportToPDF() {
        try {
            this.showNotification('Generating student report PDF...', 'info');
            
            // You can implement PDF generation here
            // For now, we'll use the browser's print-to-PDF functionality
            this.printStudentReport();
            
        } catch (error) {
            console.error('Error exporting student report to PDF:', error);
            this.showNotification('Error generating PDF report', 'error');
        }
    }

    switchReportType(e) {
        e.preventDefault();
        
        const targetType = e.currentTarget.dataset.reportType;
        const tabButtons = document.querySelectorAll('.report-tab-btn');
        const reportContents = document.querySelectorAll('.report-content');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        reportContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Add active class to clicked button
        e.currentTarget.classList.add('active');
        
        // Show corresponding content
        const targetContent = document.getElementById(`${targetType}Report`);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
        }
    }

    async refreshReports() {
        try {
            this.showLoadingState(true);
            await this.loadReportData();
            this.showNotification('Reports refreshed successfully', 'success');
        } catch (error) {
            console.error('Error refreshing reports:', error);
            this.showNotification('Error refreshing reports', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    async exportToPDF() {
        try {
            this.showNotification('Generating PDF report...', 'info');
            
            const response = await fetch('/api/reports/export/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(this.filters)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reports_${new Date().toISOString().split('T')[0]}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.showNotification('PDF report downloaded successfully', 'success');
            } else {
                throw new Error('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            this.showNotification('Error generating PDF report', 'error');
        }
    }

    async exportToExcel() {
        try {
            this.showNotification('Generating Excel report...', 'info');
            
            const response = await fetch('/api/reports/export/excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(this.filters)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reports_${new Date().toISOString().split('T')[0]}.xlsx`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.showNotification('Excel report downloaded successfully', 'success');
            } else {
                throw new Error('Failed to generate Excel file');
            }
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            this.showNotification('Error generating Excel report', 'error');
        }
    }

    async exportToCSV() {
        try {
            this.showNotification('Generating CSV report...', 'info');
            
            const response = await fetch('/api/reports/export/csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(this.filters)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reports_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.showNotification('CSV report downloaded successfully', 'success');
            } else {
                throw new Error('Failed to generate CSV file');
            }
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            this.showNotification('Error generating CSV report', 'error');
        }
    }

    showLoadingState(isLoading) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = isLoading ? 'flex' : 'none';
        }

        // Disable/enable filter controls
        const filterControls = document.querySelectorAll('select, button');
        filterControls.forEach(control => {
            control.disabled = isLoading;
        });
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
}

// Initialize reports page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reportsPage = new ReportsPage();
});
