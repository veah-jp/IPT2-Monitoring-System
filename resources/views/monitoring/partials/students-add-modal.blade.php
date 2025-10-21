<!-- Add Student Modal -->
<div class="modal fade" id="addStudentModal" tabindex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="addStudentModalLabel">
                    <i class="fas fa-user-plus me-2"></i>Add New Student
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <div class="text-center mb-4">
                    <p class="text-muted mb-0">Fill out this form to add a new student to the system! Student ID will be automatically generated.</p>
                </div>
                
                <form id="addStudentForm">
                    @csrf
                    
                    <!-- Personal Information Section -->
                    <div class="mb-4">
                        <h6 class="text-primary border-bottom pb-2 mb-3">
                            <i class="fas fa-user me-2"></i>Personal Information
                        </h6>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="first_name" class="form-label fw-bold">First Name *</label>
                                <input type="text" class="form-control form-control-lg" id="first_name" name="first_name" placeholder="Enter First Name" required>
                            </div>
                            <div class="col-md-6">
                                <label for="last_name" class="form-label fw-bold">Last Name *</label>
                                <input type="text" class="form-control form-control-lg" id="last_name" name="last_name" placeholder="Enter Last Name" required>
                            </div>
                           <div class="col-md-6">
                               <label for="gender" class="form-label fw-bold">Gender *</label>
                               <select class="form-select form-select-lg" id="gender" name="gender" required>
                                   <option value="">Select Gender</option>
                                   <option value="Male">Male</option>
                                   <option value="Female">Female</option>
                                   <option value="Other">Other</option>
                               </select>
                           </div>
                           <div class="col-md-6">
                               <label for="date_of_birth" class="form-label fw-bold">Date of Birth *</label>
                               <input type="date" class="form-control form-control-lg" id="date_of_birth" name="date_of_birth" required>
                           </div>
                           <div class="col-md-6">
                               <label for="year" class="form-label fw-bold">Year Level *</label>
                               <select class="form-select form-select-lg" id="year" name="year" required>
                                   <option value="">Select Year Level</option>
                                   <option value="1st Year">1st Year</option>
                                   <option value="2nd Year">2nd Year</option>
                                   <option value="3rd Year">3rd Year</option>
                                   <option value="4th Year">4th Year</option>
                               </select>
                           </div>
                           <div class="col-12">
                               <label for="address" class="form-label fw-bold">Address *</label>
                               <textarea class="form-control" id="address" name="address" rows="3" placeholder="Enter complete address" required></textarea>
                           </div>
                        </div>
                    </div>
                    
                    <!-- Academic Information Section -->
                    <div class="mb-4">
                        <h6 class="text-primary border-bottom pb-2 mb-3">
                            <i class="fas fa-graduation-cap me-2"></i>Academic Information
                        </h6>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="department_id" class="form-label fw-bold">Department *</label>
                                <select class="form-select form-select-lg" id="department_id" name="department_id" required>
                                    <option value="">Select Department</option>
                                    <option value="1">CSP</option>
                                    <option value="2">Engineering</option>
                                    <option value="3">BAP</option>
                                    <option value="4">ASP</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="course_id" class="form-label fw-bold">Course *</label>
                                <select class="form-select form-select-lg" id="course_id" name="course_id" required disabled>
                                    <option value="">Select Department First</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer bg-light">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-outline-warning" id="clearForm">
                    <i class="fas fa-eraser me-2"></i>Clear Form
                </button>
                <button type="submit" form="addStudentForm" class="btn btn-primary btn-lg">
                    <i class="fas fa-save me-2"></i>Add Student
                </button>
            </div>
        </div>
    </div>
</div>