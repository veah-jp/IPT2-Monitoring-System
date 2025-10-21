// Dashboard JavaScript
console.log('Dashboard.js: Loading...');

class Dashboard {
    constructor() {
        console.log('Dashboard: Constructor called');
        this.userButton = document.getElementById('userButton');
        this.userDropdown = document.getElementById('userDropdown');
        
        // Department selector elements
        this.departmentSelect = document.getElementById('departmentSelect');
        this.coursesOverview = document.getElementById('coursesOverview');
        this.coursesGrid = document.getElementById('coursesGrid');
        this.departmentName = document.getElementById('departmentName');

        // Summary card elements
        this.totalStudents = document.getElementById('totalStudents');
        this.totalFaculty = document.getElementById('totalFaculty');
        this.totalCourses = document.getElementById('totalCourses');
        this.totalEnrollments = document.getElementById('totalEnrollments');

        // Chart elements
        this.barChartSection = document.getElementById('barChartSection');
        this.enrollmentBarChart = document.getElementById('enrollmentBarChart');
        this.facultyBarChart = document.getElementById('facultyBarChart');
        this.chartInstance = null;
        this.facultyChartInstance = null;
        this.backButton = document.getElementById('backToAllDepartments');

        // Chart state
        this.currentChartType = 'students'; // 'students' or 'faculty'
        
        this.departments = [];
        this.currentDepartment = null;
        
        console.log('Dashboard: Elements found:', {
            departmentSelect: !!this.departmentSelect,
            totalStudents: !!this.totalStudents,
            totalFaculty: !!this.totalFaculty,
            enrollmentBarChart: !!this.enrollmentBarChart,
            facultyBarChart: !!this.facultyBarChart
        });
        
        this.init();
    }

    // Lightweight shadow plugin for nicer bar depth without enabling hover events
    getBarShadowPlugin() {
        return {
            id: 'barShadow',
            beforeDatasetDraw(chart, args, pluginOptions) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.shadowColor = (pluginOptions && pluginOptions.shadowColor) || 'rgba(0,0,0,0.18)';
                ctx.shadowBlur = (pluginOptions && pluginOptions.shadowBlur) || 8;
                ctx.shadowOffsetX = (pluginOptions && pluginOptions.shadowOffsetX) || 0;
                ctx.shadowOffsetY = (pluginOptions && pluginOptions.shadowOffsetY) || 4;
            },
            afterDatasetDraw(chart) {
                chart.ctx.restore();
            }
        };
    }

    // Plugin to draw numeric value labels on bars
    getBarValueLabelsPlugin() {
        return {
            id: 'barValueLabels',
            afterDatasetsDraw(chart, args, pluginOptions) {
                const { ctx, data } = chart;
                const datasets = data.datasets || [];
                const options = (chart.options && chart.options.plugins && chart.options.plugins.barValueLabels) || {};
                const fontSize = options.fontSize || 12;
                const fontFamily = options.fontFamily || 'Arial';
                const fontStyle = options.fontStyle || 'bold';
                const color = options.color || '#333';
                const yOffset = typeof options.yOffset === 'number' ? options.yOffset : 5;

                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
                ctx.fillStyle = color;

                datasets.forEach((ds, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || !meta.data) return;
                    meta.data.forEach((bar, index) => {
                        const value = ds.data && typeof ds.data[index] !== 'undefined' ? ds.data[index] : null;
                        if (value === null) return;
                        const pos = bar.getCenterPoint();
                        ctx.fillText(value, pos.x, pos.y - yOffset);
                    });
                });

                ctx.restore();
            }
        };
    }

    init() {
        this.bindEvents();
        this.fetchDepartmentsData();
        // createDefaultChart() is now called after data is loaded in fetchDepartmentsData
        this.addEntranceAnimations();
    }

    bindEvents() {
        // User dropdown
        if (this.userButton) {
            this.userButton.addEventListener('click', () => {
                this.toggleUserDropdown();
            });
        }

        // Department selector
        if (this.departmentSelect) {
            this.departmentSelect.addEventListener('change', (e) => {
                this.handleDepartmentChange(e.target.value);
            });
        }

        // Back button (to all departments)
        if (this.backButton) {
            console.log('Back button found and event listener added');
            this.backButton.addEventListener('click', () => {
                console.log('Back button clicked!');
                if (this.departmentSelect) {
                    this.departmentSelect.value = '';
                }
                this.currentDepartment = null;
                this.hideBackButton();
                this.handleDepartmentChange('');
            });
        } else {
            console.log('Back button element not found during initialization!');
        }

        // Summary card click handlers removed (charts always visible)

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.closeUserDropdown();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeUserDropdown();
            }
        });
    }

    async fetchDepartmentsData() {
        try {
            const response = await fetch('/api/departments-data');
            const data = await response.json();

            if (data.success) {
                const fetched = Array.isArray(data.departments) ? data.departments : [];
                // Exclude archived departments using multiple flags for safety
                this.departments = fetched.filter(d => {
                    if (!d) return false;
                    const inactive = (d.is_active === 0 || d.is_active === false);
                    const archived = (d.is_archived === 1 || d.archived === 1 || d.status === 'archived');
                    return !(inactive || archived);
                });
                this.populateDepartmentDropdown();
                // Show total counts immediately after data is loaded
                this.resetSummaryCards();
                // Create default charts immediately after data is loaded
                this.createDefaultChart();
                this.createDefaultFacultyChart();
                console.log('Departments data loaded:', this.departments);
            } else {
                console.error('Error loading departments:', data.message);
                this.showNotification('Error loading departments data', 'error');
            }
        } catch (error) {
            console.error('Error fetching departments data:', error);
            this.showNotification('Failed to load departments data', 'error');
        }
    }

    populateDepartmentDropdown() {
        if (!this.departmentSelect) return;
        
        // Clear existing options except the first one
        while (this.departmentSelect.children.length > 1) {
            this.departmentSelect.removeChild(this.departmentSelect.lastChild);
        }
        
        this.departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            this.departmentSelect.appendChild(option);
        });
    }

    handleDepartmentChange(departmentId) {
        if (!departmentId) {
            this.hideCoursesOverview();
            // Update BOTH charts to default when no department selected
            this.createDefaultChart();
            this.createDefaultFacultyChart();
            this.resetSummaryCards();
            this.hideBackButton();
            if (this.backButton) {
                console.log('Back button hidden, display=', this.backButton.style.display);
            }
            return;
        }
        
        const department = this.departments.find(d => d.id == departmentId);
        if (department) {
            this.currentDepartment = department;
            this.updateSummaryCards(department);
            this.showCoursesOverview(department);
            // Update BOTH charts for selected department
            this.createDepartmentChart(department);
            this.createDepartmentFacultyChart(department);
            this.updateDepartmentName(department.name);
            this.showBackButton();
            if (this.backButton) {
                console.log('Back button shown, display=', this.backButton.style.display);
            }
        }
    }

    updateSummaryCards(department) {
        if (this.totalStudents) this.totalStudents.textContent = department.totalStudents;
        if (this.totalFaculty) this.totalFaculty.textContent = department.totalFaculty;
        if (this.totalCourses) this.totalCourses.textContent = department.courses.length;
        if (this.totalEnrollments) this.totalEnrollments.textContent = department.totalEnrollments;
    }

    resetSummaryCards() {
        // Calculate totals from all departments
        const totalStudents = this.departments.reduce((sum, dept) => sum + dept.totalStudents, 0);
        const totalFaculty = this.departments.reduce((sum, dept) => sum + dept.totalFaculty, 0);
        
        if (this.totalStudents) this.totalStudents.textContent = totalStudents.toLocaleString();
        if (this.totalFaculty) this.totalFaculty.textContent = totalFaculty.toLocaleString();
        if (this.totalCourses) this.totalCourses.textContent = '0';
        if (this.totalEnrollments) this.totalEnrollments.textContent = '0';
    }

    showCoursesOverview(department) {
        if (!this.coursesOverview || !this.coursesGrid) return;
        
        this.coursesOverview.style.display = 'block';
        // Render only active courses
        const activeCourses = (department.courses || []).filter(c => (c && (c.is_active === undefined || c.is_active !== 0)));
        this.renderCoursesGrid(activeCourses);
        
        this.coursesOverview.classList.add('fade-in');
        setTimeout(() => {
            this.coursesOverview.classList.remove('fade-in');
        }, 500);
    }

    hideCoursesOverview() {
        if (this.coursesOverview) {
            this.coursesOverview.style.display = 'none';
        }
    }

    updateDepartmentName(name) {
        if (this.departmentName) {
            this.departmentName.textContent = name;
        }
    }

    renderCoursesGrid(courses) {
        if (!this.coursesGrid) return;
        
        this.coursesGrid.innerHTML = '';
        
        courses.forEach(course => {
            const courseElement = this.createCourseElement(course);
            this.coursesGrid.appendChild(courseElement);
        });
    }

    createCourseElement(course) {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'col-md-3';
        courseDiv.innerHTML = `
            <div class="course-item">
                <div class="course-icon ${course.color}">
                    <i class="${course.icon}"></i>
                </div>
                <h4>${course.name}</h4>
                <p>${course.fullName}</p>
                <div class="course-stats">
                    <span class="students">${course.students} Students</span>
                </div>
            </div>
        `;
        return courseDiv;
    }

    showStudentChart() {
        console.log('Switching to student chart');
        this.currentChartType = 'students';
        this.updateChartTitle('Student Enrollment by Course');
        this.updateChartDescription('Number of students enrolled in each course');
        
        // Update active states
        this.updateActiveSummaryCard('students');
        
        // Both charts visible
        if (this.facultyBarChart) this.facultyBarChart.style.display = 'block';
        if (this.enrollmentBarChart) this.enrollmentBarChart.style.display = 'block';
        
        if (this.currentDepartment) {
            this.createDepartmentChart(this.currentDepartment);
            this.showBackButton(); // Show back button if department is selected
        } else {
            this.createDefaultChart();
            this.hideBackButton(); // Hide back button for default view
        }
        
        // Update summary cards
        if (this.currentDepartment) {
            this.updateSummaryCards(this.currentDepartment);
        } else {
            this.resetSummaryCards();
        }
    }

    showFacultyChart() {
        console.log('Switching to faculty chart');
        this.currentChartType = 'faculty';
        this.updateChartTitle('Faculty Distribution by Department');
        this.updateChartDescription('Number of faculty members in each department');
        
        // Update active states
        this.updateActiveSummaryCard('faculty');
        
        // Both charts visible
        if (this.enrollmentBarChart) this.enrollmentBarChart.style.display = 'block';
        if (this.facultyBarChart) this.facultyBarChart.style.display = 'block';
        
        if (this.currentDepartment) {
            this.createDepartmentFacultyChart(this.currentDepartment);
            this.showBackButton(); // Show back button if department is selected
        } else {
            this.createDefaultFacultyChart();
            this.hideBackButton(); // Hide back button for default view
        }
        
        // Update summary cards to show faculty-focused data
        if (this.currentDepartment) {
            this.updateSummaryCards(this.currentDepartment);
        } else {
            this.resetSummaryCards();
        }
    }

    updateChartTitle(title) {
        const chartTitle = document.querySelector('.chart-header h3');
        if (chartTitle) {
            chartTitle.innerHTML = `<i class="fas fa-chart-bar"></i> ${title}`;
        }
    }

    updateChartDescription(description) {
        const chartDesc = document.querySelector('.chart-header p');
        if (chartDesc) {
            chartDesc.textContent = description;
        }
    }

    updateActiveSummaryCard(chartType) {
        // Remove active class from all summary cards
        const allSummaryCards = document.querySelectorAll('.summary-card');
        allSummaryCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to the clicked card
        if (chartType === 'students' && this.totalStudents) {
            this.totalStudents.closest('.summary-card').classList.add('active');
        } else if (chartType === 'faculty' && this.totalFaculty) {
            this.totalFaculty.closest('.summary-card').classList.add('active');
        }
    }

    createDefaultChart() {
        if (!this.enrollmentBarChart) return;
        
        // Destroy existing chart if it exists (safely)
        if (this.chartInstance) {
            try { this.chartInstance.stop(); } catch (e) {}
            try { this.chartInstance.destroy(); } catch (e) {}
            this.chartInstance = null;
        }
        // Clear any globally registered plugins that could be invalid
        try {
            if (Chart && Chart.registry && Chart.registry.plugins) {
                const allPlugins = Chart.registry.plugins.getAll();
                if (Array.isArray(allPlugins) && allPlugins.length) {
                    allPlugins.forEach(p => {
                        try { Chart.unregister(p); } catch (e) { /* ignore */ }
                    });
                }
            }
        } catch (e) {
            // ignore
        }
        // When showing default/all departments, ensure back button is hidden
        this.hideBackButton();

        // Get total students per department for the default chart (exclude archived)
        const departmentData = this.departments
            .filter(dept => (dept && (dept.is_active === undefined || dept.is_active !== 0)))
            .map(dept => ({
            name: dept.name,
            totalStudents: dept.totalStudents
        }));

        const labels = departmentData.map(dept => dept.name);
        const data = departmentData.map(dept => dept.totalStudents);

        // Create default chart showing all departments
        const ctx = this.enrollmentBarChart.getContext('2d');
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Students',
                    data: data,
                    backgroundColor: [
                        'rgba(78, 115, 223, 0.8)',
                        'rgba(111, 66, 193, 0.8)',
                        'rgba(32, 201, 166, 0.8)',
                        'rgba(23, 162, 184, 0.8)'
                    ],
                    borderColor: [
                        'rgba(78, 115, 223, 1)',
                        'rgba(111, 66, 193, 1)',
                        'rgba(32, 201, 166, 1)',
                        'rgba(23, 162, 184, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: [],
                animation: {
                    duration: 900,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Students: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#666',
                            font: { size: 11 }
                        }
                    }
                },
                barShadow: {
                    shadowColor: 'rgba(0,0,0,0.15)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4
                }
            }
        };
        // Attach shadow + value labels plugins
        config.plugins = [this.getBarShadowPlugin(), this.getBarValueLabelsPlugin()];
        // Configure value labels
        config.options.plugins.barValueLabels = {
            fontSize: 12,
            color: '#333',
            yOffset: 6
        };
        this.chartInstance = new Chart(ctx, config);


        // Update summary cards with totals from all departments
        this.resetSummaryCards();
        
        // Set initial active state
        this.updateActiveSummaryCard('students');
    }

    createDefaultFacultyChart() {
        if (!this.facultyBarChart) return;
        
        // Destroy existing faculty chart if it exists (safely)
        if (this.facultyChartInstance) {
            try { this.facultyChartInstance.stop(); } catch (e) {}
            try { this.facultyChartInstance.destroy(); } catch (e) {}
            this.facultyChartInstance = null;
        }
        
        // Hide back button for default view
        this.hideBackButton();

        // Get total faculty per department for the default chart (exclude archived)
        const departmentData = this.departments
            .filter(dept => (dept && (dept.is_active === undefined || dept.is_active !== 0)))
            .map(dept => ({
            name: dept.name,
            totalFaculty: dept.totalFaculty
        }));

        const labels = departmentData.map(dept => dept.name);
        const data = departmentData.map(dept => dept.totalFaculty);

        // Create default faculty chart showing all departments
        const ctx = this.facultyBarChart.getContext('2d');
        const config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Faculty',
                    data: data,
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(23, 162, 184, 0.8)'
                    ],
                    borderColor: [
                        'rgba(220, 53, 69, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(40, 167, 69, 1)',
                        'rgba(23, 162, 184, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: [],
                animation: {
                    duration: 900,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Faculty: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#666',
                            font: { size: 11 }
                        }
                    }
                },
                barShadow: {
                    shadowColor: 'rgba(0,0,0,0.15)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4
                }
            }
        };
        config.plugins = [this.getBarShadowPlugin(), this.getBarValueLabelsPlugin()];
        config.options.plugins.barValueLabels = {
            fontSize: 12,
            color: '#333',
            yOffset: 6
        };
        this.facultyChartInstance = new Chart(ctx, config);


        // Update summary cards with totals from all departments
        this.resetSummaryCards();
    }

    createDepartmentChart(department) {
        if (!this.enrollmentBarChart) return;

        // Destroy existing chart if it exists (safely)
        if (this.chartInstance) {
            try { this.chartInstance.stop(); } catch (e) {}
            try { this.chartInstance.destroy(); } catch (e) {}
            this.chartInstance = null;
        }

        // Prepare chart data
        // Exclude archived courses in department view
        const activeCourses = (department.courses || []).filter(c => (c && (c.is_active === undefined || c.is_active !== 0)));
        const courseNames = activeCourses.map(course => course.name);
        const studentCounts = activeCourses.map(course => course.students);
        const courseColors = activeCourses.map(course => this.getCourseChartColor(course.name));

        // Create new chart
        const ctx = this.enrollmentBarChart.getContext('2d');
        const config = {
            type: 'bar',
            data: {
                labels: courseNames,
                datasets: [{
                    label: 'Students Enrolled',
                    data: studentCounts,
                    backgroundColor: courseColors,
                    borderColor: courseColors.map(color => this.adjustColor(color, -20)),
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: [],
                animation: {
                    duration: 900,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Students: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#666',
                            font: { size: 11 },
                            maxRotation: 45
                        }
                    }
                },
                barShadow: {
                    shadowColor: 'rgba(0,0,0,0.15)',
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 4
                }
            }
        };
        config.plugins = [this.getBarShadowPlugin(), this.getBarValueLabelsPlugin()];
        config.options.plugins.barValueLabels = {
            fontSize: 12,
            color: '#333',
            yOffset: 6
        };
        this.chartInstance = new Chart(ctx, config);
    }

    createDepartmentFacultyChart(department) {
        if (!this.facultyBarChart) return;

        // Destroy existing faculty chart if it exists
        if (this.facultyChartInstance) {
            this.facultyChartInstance.destroy();
        }

        // For department faculty chart, we'll show faculty count for this department
        const labels = [department.name];
        const data = [department.totalFaculty];

        // Create new faculty chart
        const ctx = this.facultyBarChart.getContext('2d');
        this.facultyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Faculty Members',
                    data: data,
                    backgroundColor: ['rgba(220, 53, 69, 0.8)'],
                    borderColor: ['rgba(220, 53, 69, 1)'],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Faculty: ${context.parsed.y}`;
                            }
                        }
                    }
                ,
                    barShadow: {
                        shadowColor: 'rgba(0,0,0,0.15)',
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowOffsetY: 4
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: { size: 12 },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#666',
                            font: { size: 11 }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart',
                    onProgress: function(animation) {
                        const chart = animation.chart;
                        const ctx = chart.ctx;
                        const dataset = chart.data.datasets[0];
                        const meta = chart.getDatasetMeta(0);

                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            const position = bar.getCenterPoint();
                            
                            ctx.save();
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillStyle = '#333';
                            
                            if (data > 0) {
                                ctx.fillText(data, position.x, position.y - 5);
                            }
                            ctx.restore();
                        });
                    }
                }
            }
        });
        // add subtle shadow + value labels plugin to department faculty chart instance
        this.facultyChartInstance.config.plugins = [this.getBarShadowPlugin(), this.getBarValueLabelsPlugin()];
    }

    getCourseChartColor(courseName) {
        const colorMap = {
            'BSIT': '#4e73df',
            'BSCS': '#1cc88a',
            'BSLIB': '#36b9cc',
            'MULTIMEDIA': '#f6c23e',
            'ANIMATION': '#e74a3b',
            'BSCE': '#6f42c1',
            'BSIE': '#fd7e14',
            'BSBA': '#20c9a6',
            'BSHR': '#5a5c69',
            'BSBE': '#6610f2',
            'BSMM': '#e83e8c',
            'BSFM': '#fd7e14',
            'BSH': '#28a745',
            'BSSS': '#17a2b8',
            'BSNS': '#ffc107',
            'BSP': '#dc3545'
        };
        
        return colorMap[courseName] || '#6c757d';
    }

    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    // Utility methods
    toggleUserDropdown() {
        if (this.userDropdown) {
            this.userDropdown.classList.toggle('show');
        }
    }

    closeUserDropdown() {
        if (this.userDropdown) {
            this.userDropdown.classList.remove('show');
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    refreshDashboardData() {
        this.fetchDepartmentsData();
    }

    addEntranceAnimations() {
        const elements = document.querySelectorAll('.summary-card, .chart-card, .selector-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in');
            }, index * 100);
        });
    }

    showBackButton() {
        if (this.backButton) {
            this.backButton.style.display = 'inline-flex';
            this.backButton.style.visibility = 'visible';
            this.backButton.style.opacity = '1';
            console.log('Back button shown, display set to:', this.backButton.style.display);
            console.log('Back button element:', this.backButton);
            console.log('Back button computed styles:', window.getComputedStyle(this.backButton));
            console.log('Back button position:', this.backButton.offsetLeft, this.backButton.offsetTop);
            console.log('Back button dimensions:', this.backButton.offsetWidth, this.backButton.offsetHeight);
        } else {
            console.log('Back button element not found!');
        }
    }

    hideBackButton() {
        if (this.backButton) {
            this.backButton.style.display = 'none';
            this.backButton.style.visibility = 'hidden';
            this.backButton.style.opacity = '0';
            console.log('Back button hidden');
        } else {
            console.log('Back button element not found!');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Guard against plugin hover/afterEvent issues
    try {
        if (Chart && Chart.defaults) {
            Chart.defaults.events = ['click'];
            Chart.defaults.animation = false;
            if (Chart.defaults.plugins && Chart.defaults.plugins.tooltip) {
                Chart.defaults.plugins.tooltip.enabled = true;
            }
            if (Chart.defaults.plugins && Chart.defaults.plugins.legend) {
                Chart.defaults.plugins.legend.display = false;
            }
        }
    } catch (e) {}
    window.dashboard = new Dashboard();
    
    // Show welcome notification
    setTimeout(() => {
        if (window.dashboard) {
            window.dashboard.showNotification('Welcome to the Student and Faculty Management System!', 'success');
        }
    }, 1000);
});
