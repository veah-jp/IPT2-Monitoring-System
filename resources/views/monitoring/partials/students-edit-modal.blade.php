<!-- Edit Student Modal -->
<div class="modal fade" id="editStudentModal" tabindex="-1" aria-labelledby="editStudentModalLabel" aria-describedby="editStudentModalDescription">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-warning text-white">
                <h5 class="modal-title" id="editStudentModalLabel">
                    <i class="fas fa-user-edit me-2"></i>Edit Student
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <div class="text-center mb-4" id="editStudentModalDescription">
                    <p class="text-muted mb-0">Update the student information below. All fields including Student ID can be modified.</p>
                </div>
                
                <form id="editStudentForm">
                    @csrf
                    @method('PUT')
                    
                    <!-- Student ID (Read-only) -->
                    <div class="mb-4">
                        <h6 class="text-warning border-bottom pb-2 mb-3">
                            <i class="fas fa-id-card me-2"></i>Student Information
                        </h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="edit_student_id" class="form-label fw-bold">Student ID *</label>
                                <input type="text" class="form-control form-control-lg" id="edit_student_id" name="edit_student_id" placeholder="Enter Student ID" required>
                                <small class="text-muted">You can modify the student ID if needed</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Personal Information Section -->
                    <div class="mb-4">
                        <h6 class="text-primary border-bottom pb-2 mb-3">
                            <i class="fas fa-user me-2"></i>Personal Information
                        </h6>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="edit_first_name" class="form-label fw-bold">First Name *</label>
                                <input type="text" class="form-control form-control-lg" id="edit_first_name" name="edit_first_name" placeholder="Enter First Name" required>
                            </div>
                            <div class="col-md-6">
                                <label for="edit_last_name" class="form-label fw-bold">Last Name *</label>
                                <input type="text" class="form-control form-control-lg" id="edit_last_name" name="edit_last_name" placeholder="Enter Last Name" required>
                            </div>
                           <div class="col-md-6">
                               <label for="edit_gender" class="form-label fw-bold">Gender *</label>
                               <select class="form-select form-select-lg" id="edit_gender" name="edit_gender" required>
                                   <option value="">Select Gender</option>
                                   <option value="Male">Male</option>
                                   <option value="Female">Female</option>
                                   <option value="Other">Other</option>
                               </select>
                           </div>
                           <div class="col-md-6">
                               <label for="edit_date_of_birth" class="form-label fw-bold">Date of Birth *</label>
                               <input type="date" class="form-control form-control-lg" id="edit_date_of_birth" name="edit_date_of_birth" required>
                           </div>
                           <div class="col-md-6">
                               <label for="edit_year" class="form-label fw-bold">Year Level *</label>
                               <select class="form-select form-select-lg" id="edit_year" name="edit_year" required>
                                   <option value="">Select Year Level</option>
                                   <option value="1st Year">1st Year</option>
                                   <option value="2nd Year">2nd Year</option>
                                   <option value="3rd Year">3rd Year</option>
                                   <option value="4th Year">4th Year</option>
                               </select>
                           </div>
                           <div class="col-12">
                               <label for="edit_address" class="form-label fw-bold">Address *</label>
                               <textarea class="form-control" id="edit_address" name="edit_address" rows="3" placeholder="Enter complete address" required></textarea>
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
                                <label for="edit_department_id" class="form-label fw-bold">Department *</label>
                                <select class="form-select form-select-lg" id="edit_department_id" name="edit_department_id" required>
                                    <option value="">Select Department</option>
                                    <option value="1">CSP</option>
                                    <option value="2">Engineering</option>
                                    <option value="3">BAP</option>
                                    <option value="4">ASP</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="edit_course_id" class="form-label fw-bold">Course *</label>
                                <select class="form-select form-select-lg" id="edit_course_id" name="edit_course_id" required disabled>
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
                <button type="button" class="btn btn-outline-warning" id="clearEditForm">
                    <i class="fas fa-eraser me-2"></i>Clear Changes
                </button>
                <button type="submit" form="editStudentForm" class="btn btn-warning btn-lg">
                    <i class="fas fa-save me-2"></i>Update Student
                </button>
            </div>
        </div>
    </div>
</div>