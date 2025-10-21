import React, { useState, useEffect } from 'react';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        address: '',
        department_id: '',
        course_id: '',
        year: ''
    });
    
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Load departments on component mount
    useEffect(() => {
        loadDepartments();
    }, []);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const loadDepartments = async () => {
        try {
            const response = await fetch('/api/departments-data');
            const data = await response.json();
            console.log('Departments API response:', data);
            if (data.success) {
                setDepartments(data.departments || []);
                console.log('Departments loaded:', data.departments);
            }
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const loadCourses = async (departmentId) => {
        if (!departmentId) {
            setCourses([]);
            return;
        }

        try {
            const response = await fetch(`/api/courses-by-department?department_id=${encodeURIComponent(departmentId)}`);
            const data = await response.json();
            console.log('Courses API response for department', departmentId, ':', data);
            if (data.courses) {
                // Filter out archived courses
                const activeCourses = data.courses.filter(course => course.is_active !== 0);
                setCourses(activeCourses);
                console.log('Courses loaded for department', departmentId, ':', activeCourses);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // If department changes, load courses and reset course selection
        if (name === 'department_id') {
            setFormData(prev => ({
                ...prev,
                department_id: value,
                course_id: '' // Reset course selection
            }));
            loadCourses(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.department_id) newErrors.department_id = 'Department is required';
        if (!formData.course_id) newErrors.course_id = 'Course is required';
        if (!formData.year) newErrors.year = 'Year is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Student added successfully!', 'success');
                resetForm();
                onClose();
                if (onStudentAdded) {
                    onStudentAdded(data.student);
                }
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    showNotification(data.message || 'Error adding student', 'error');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Error adding student. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            gender: '',
            date_of_birth: '',
            address: '',
            department_id: '',
            course_id: '',
            year: ''
        });
        setCourses([]);
        setErrors({});
    };

    const showNotification = (message, type) => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="fas fa-user-plus me-2"></i>
                            Add New Student
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={onClose}
                            disabled={loading}
                        ></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                {/* First Name */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="first_name" className="form-label">
                                        <i className="fas fa-user me-1"></i>
                                        First Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-lg ${errors.first_name ? 'is-invalid' : ''}`}
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter First Name"
                                        disabled={loading}
                                    />
                                    {errors.first_name && (
                                        <div className="invalid-feedback">{errors.first_name}</div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="last_name" className="form-label">
                                        <i className="fas fa-user me-1"></i>
                                        Last Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-lg ${errors.last_name ? 'is-invalid' : ''}`}
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Last Name"
                                        disabled={loading}
                                    />
                                    {errors.last_name && (
                                        <div className="invalid-feedback">{errors.last_name}</div>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="gender" className="form-label">
                                        <i className="fas fa-venus-mars me-1"></i>
                                        Gender <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select form-select-lg ${errors.gender ? 'is-invalid' : ''}`}
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && (
                                        <div className="invalid-feedback">{errors.gender}</div>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="date_of_birth" className="form-label">
                                        <i className="fas fa-calendar me-1"></i>
                                        Date of Birth <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control form-control-lg ${errors.date_of_birth ? 'is-invalid' : ''}`}
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    {errors.date_of_birth && (
                                        <div className="invalid-feedback">{errors.date_of_birth}</div>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="col-12 mb-3">
                                    <label htmlFor="address" className="form-label">
                                        <i className="fas fa-map-marker-alt me-1"></i>
                                        Address <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        id="address"
                                        name="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter complete address"
                                        disabled={loading}
                                    ></textarea>
                                    {errors.address && (
                                        <div className="invalid-feedback">{errors.address}</div>
                                    )}
                                </div>

                                {/* Department */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="department_id" className="form-label">
                                        <i className="fas fa-building me-1"></i>
                                        Department <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select form-select-lg ${errors.department_id ? 'is-invalid' : ''}`}
                                        id="department_id"
                                        name="department_id"
                                        value={formData.department_id}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept, index) => (
                                            <option key={dept.id || `dept-${index}`} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department_id && (
                                        <div className="invalid-feedback">{errors.department_id}</div>
                                    )}
                                </div>

                                {/* Course */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="course_id" className="form-label">
                                        <i className="fas fa-graduation-cap me-1"></i>
                                        Course <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select form-select-lg ${errors.course_id ? 'is-invalid' : ''}`}
                                        id="course_id"
                                        name="course_id"
                                        value={formData.course_id}
                                        onChange={handleInputChange}
                                        disabled={!formData.department_id || loading}
                                    >
                                        <option value="">
                                            {!formData.department_id ? 'Select Department First' : 'Select Course'}
                                        </option>
                                        {courses.map((course, index) => (
                                            <option key={course.id || `course-${index}`} value={course.id}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.course_id && (
                                        <div className="invalid-feedback">{errors.course_id}</div>
                                    )}
                                </div>

                                {/* Year */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="year" className="form-label">
                                        <i className="fas fa-calendar-alt me-1"></i>
                                        Year Level <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select form-select-lg ${errors.year ? 'is-invalid' : ''}`}
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="5th Year">5th Year</option>
                                    </select>
                                    {errors.year && (
                                        <div className="invalid-feedback">{errors.year}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer bg-light">
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-lg" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                <i className="fas fa-times me-2"></i>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus me-2"></i>
                                        Add Student
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;
