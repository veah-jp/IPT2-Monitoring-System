import React, { useState, useEffect } from 'react';

const DUPLICATE_ERROR_MESSAGE = 'This faculty member already exists.';

const AddFacultyModal = ({ isOpen, onClose, onFacultyAdded }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        email: '',
        phone: '',
        department_id: '',
        hire_date: ''
    });
    
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [existingFaculty, setExistingFaculty] = useState([]);

    // Load departments on component mount
    useEffect(() => {
        loadDepartments();
    }, []);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            resetForm();
            loadExistingFaculty(true);
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

    const loadExistingFaculty = async (force = false) => {
        try {
            if (!force && existingFaculty.length > 0) {
                return existingFaculty;
            }

            const response = await fetch('/api/faculty');
            if (!response.ok) {
                throw new Error(`Failed to load faculty: ${response.status}`);
            }

            const data = await response.json();
            const normalized = Array.isArray(data)
                ? data
                    .filter(member => member && (member.is_active === null || member.is_active === undefined || member.is_active === 1))
                    .map(member => ({
                        first_name: (member.first_name || '').trim(),
                        last_name: (member.last_name || '').trim()
                    }))
                : [];

            setExistingFaculty(normalized);
            return normalized;
        } catch (error) {
            console.error('Error loading existing faculty:', error);
            return existingFaculty;
        }
    };

    const isDuplicateFaculty = (firstName, lastName, facultyList = existingFaculty) => {
        if (!firstName || !lastName) {
            return false;
        }

        const normalizedFirst = firstName.trim().toLowerCase();
        const normalizedLast = lastName.trim().toLowerCase();

        if (!normalizedFirst || !normalizedLast) {
            return false;
        }

        return facultyList.some(member => {
            const memberFirst = (member.first_name || '').trim().toLowerCase();
            const memberLast = (member.last_name || '').trim().toLowerCase();
            return memberFirst === normalizedFirst && memberLast === normalizedLast;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if ((name === 'first_name' || name === 'last_name') && existingFaculty.length === 0) {
            loadExistingFaculty();
        }

        const nextFirstName = name === 'first_name' ? value : formData.first_name;
        const nextLastName = name === 'last_name' ? value : formData.last_name;
        const duplicate = isDuplicateFaculty(nextFirstName, nextLastName);

        setErrors(prev => {
            const updated = { ...prev };

            if (name === 'first_name' && updated.first_name && updated.first_name !== DUPLICATE_ERROR_MESSAGE) {
                delete updated.first_name;
            }

            if (name === 'last_name' && updated.last_name && updated.last_name !== DUPLICATE_ERROR_MESSAGE) {
                delete updated.last_name;
            }

            if (name === 'gender' && updated.gender) {
                delete updated.gender;
            }

            if (name === 'date_of_birth' && updated.date_of_birth) {
                delete updated.date_of_birth;
            }

            if (name === 'email' && updated.email && updated.email !== DUPLICATE_ERROR_MESSAGE) {
                delete updated.email;
            }

            if (name === 'phone' && updated.phone) {
                delete updated.phone;
            }

            if (name === 'department_id' && updated.department_id) {
                delete updated.department_id;
            }

            if (name === 'hire_date' && updated.hire_date) {
                delete updated.hire_date;
            }

            if (duplicate) {
                updated.first_name = DUPLICATE_ERROR_MESSAGE;
                updated.last_name = DUPLICATE_ERROR_MESSAGE;
            } else {
                if (updated.first_name === DUPLICATE_ERROR_MESSAGE) {
                    delete updated.first_name;
                }
                if (updated.last_name === DUPLICATE_ERROR_MESSAGE) {
                    delete updated.last_name;
                }
            }

            return updated;
        });
    };

    const validateForm = (facultyList = existingFaculty) => {
        const newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!newErrors.first_name && !newErrors.last_name) {
            if (isDuplicateFaculty(formData.first_name, formData.last_name, facultyList)) {
                newErrors.first_name = DUPLICATE_ERROR_MESSAGE;
                newErrors.last_name = DUPLICATE_ERROR_MESSAGE;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const facultyList = existingFaculty.length > 0 ? existingFaculty : await loadExistingFaculty();

        if (!validateForm(facultyList)) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/faculty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Faculty member added successfully!', 'success');
                resetForm();
                onClose();
                if (onFacultyAdded) {
                    onFacultyAdded(data.faculty);
                }
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    showNotification(data.message || 'Error adding faculty member', 'error');
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Error adding faculty member. Please try again.', 'error');
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
            email: '',
            phone: '',
            department_id: '',
            hire_date: ''
        });
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

    const handleClose = () => {
        if (loading) return;
        if (onClose) {
            onClose();
        }
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="fas fa-chalkboard-teacher me-2"></i>
                            Add New Faculty Member
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={handleClose}
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
                                        Gender
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
                                        Date of Birth
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

                                {/* Email */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="fas fa-envelope me-1"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Email Address"
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        <i className="fas fa-phone me-1"></i>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter Phone Number"
                                        disabled={loading}
                                    />
                                    {errors.phone && (
                                        <div className="invalid-feedback">{errors.phone}</div>
                                    )}
                                </div>

                                {/* Department */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="department_id" className="form-label">
                                        <i className="fas fa-building me-1"></i>
                                        Department
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

                                {/* Hire Date */}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="hire_date" className="form-label">
                                        <i className="fas fa-calendar-check me-1"></i>
                                        Hire Date
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control form-control-lg ${errors.hire_date ? 'is-invalid' : ''}`}
                                        id="hire_date"
                                        name="hire_date"
                                        value={formData.hire_date}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    {errors.hire_date && (
                                        <div className="invalid-feedback">{errors.hire_date}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer bg-light">
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-lg" 
                                onClick={handleClose}
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
                                        Add Faculty Member
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

export default AddFacultyModal;
