<style>
/* Faculty table responsive styling */
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table th, .table td {
    white-space: nowrap;
    min-width: 120px;
}

.table th:nth-child(1), .table td:nth-child(1) { min-width: 80px; } /* Faculty ID */
.table th:nth-child(2), .table td:nth-child(2) { min-width: 100px; } /* First Name */
.table th:nth-child(3), .table td:nth-child(3) { min-width: 100px; } /* Last Name */
.table th:nth-child(4), .table td:nth-child(4) { min-width: 80px; } /* Gender */
.table th:nth-child(5), .table td:nth-child(5) { min-width: 100px; } /* Date of Birth */
.table th:nth-child(6), .table td:nth-child(6) { min-width: 150px; } /* Department */
.table th:nth-child(7), .table td:nth-child(7) { min-width: 180px; } /* Email */
.table th:nth-child(8), .table td:nth-child(8) { min-width: 100px; } /* Phone */
.table th:nth-child(9), .table td:nth-child(9) { min-width: 100px; } /* Hire Date */
.table th:nth-child(10), .table td:nth-child(10) { min-width: 120px; } /* Actions */

/* Show full email without truncation; horizontal scroll will handle width */
.table td:nth-child(7) {
}

/* Show full department in one line; page will scroll horizontally */
.table td:nth-child(6) {
    white-space: nowrap;
}
.table td:nth-child(6) .badge {
    white-space: nowrap;
}
</style>

<!-- Search and Filter Section -->
<div class="row mb-4">
    <div class="col-md-6">
        <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
                <i class="fas fa-search text-muted"></i>
            </span>
            <input type="text" class="form-control border-start-0" placeholder="Search Faculty" id="facultySearch">
        </div>
    </div>
    <div class="col-md-6">
        <select class="form-select" id="departmentFilter">
            <option value="">Filter by Department</option>
            @foreach($departments as $dept)
                <option value="{{ $dept->department_id }}">{{ $dept->department_name }}</option>
            @endforeach
        </select>
    </div>
</div>

<!-- Action Buttons -->
<div class="row mb-4">
    <div class="col-12">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-primary" id="addFacultyBtn">
                <i class="fas fa-plus me-2"></i>Add Faculty
            </button>
            <button type="button" class="btn btn-outline-secondary" id="editFacultyBtn">
                <i class="fas fa-user-edit me-2"></i>Edit Faculty
            </button>
            <button type="button" class="btn btn-outline-info active" id="archiveFacultyBtn">
                <i class="fas fa-user me-2"></i>Archive Faculty
            </button>
        </div>
    </div>
</div>

<!-- Edit Mode Button (Hidden by default) -->
<div class="row mb-4" id="editModeRow" style="display: none;">
    <div class="col-12">
        <button type="button" class="btn btn-outline-secondary" id="exitEditModeBtn">
            <i class="fas fa-times me-2"></i>Exit Edit Mode
        </button>
    </div>
</div>

@if($faculty->count() > 0)
    <!-- Faculty Table -->
    <div class="card">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="border-0 px-4 py-3">Faculty ID</th>
                            <th class="border-0 px-4 py-3">First Name</th>
                            <th class="border-0 px-4 py-3">Last Name</th>
                            <th class="border-0 px-4 py-3">Gender</th>
                            <th class="border-0 px-4 py-3">Date of Birth</th>
                            <th class="border-0 px-4 py-3">Department</th>
                            <th class="border-0 px-4 py-3">Email</th>
                            <th class="border-0 px-4 py-3">Phone</th>
                            <th class="border-0 px-4 py-3">Hire Date</th>
                            <th class="border-0 px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($faculty as $member)
                            <tr class="border-bottom" data-faculty-id="{{ $member->faculty_id }}">
                                <td class="px-4 py-3">
                                    <strong>{{ $member->faculty_id ?? 'N/A' }}</strong>
                                </td>
                                <td class="px-4 py-3" data-field="first_name" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text">{{ $member->first_name }}</span>
                                    <input type="text" class="form-control form-control-sm d-none editable-input" data-field="first_name" value="{{ $member->first_name }}">
                                </td>
                                <td class="px-4 py-3" data-field="last_name" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text">{{ $member->last_name }}</span>
                                    <input type="text" class="form-control form-control-sm d-none editable-input" data-field="last_name" value="{{ $member->last_name }}">
                                </td>
                                <td class="px-4 py-3" data-field="gender" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text badge bg-secondary">{{ $member->gender ?? 'N/A' }}</span>
                                    <select class="form-select form-select-sm d-none editable-input" data-field="gender">
                                        <option value="">Select Gender</option>
                                        <option value="Male" {{ $member->gender == 'Male' ? 'selected' : '' }}>Male</option>
                                        <option value="Female" {{ $member->gender == 'Female' ? 'selected' : '' }}>Female</option>
                                        <option value="Other" {{ $member->gender == 'Other' ? 'selected' : '' }}>Other</option>
                                    </select>
                                </td>
                                <td class="px-4 py-3" data-field="date_of_birth" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text">{{ $member->date_of_birth ? \Carbon\Carbon::parse($member->date_of_birth)->format('M d, Y') : 'N/A' }}</span>
                                    <input type="date" class="form-control form-control-sm d-none editable-input" data-field="date_of_birth" value="{{ $member->date_of_birth ? \Carbon\Carbon::parse($member->date_of_birth)->format('Y-m-d') : '' }}">
                                </td>
                                <td class="px-4 py-3" data-field="department_id" data-faculty-id="{{ $member->faculty_id }}">
                                    @if($member->department)
                                        <span class="editable-text badge bg-primary">{{ $member->department->department_name }}</span>
                                        <select class="form-select form-select-sm d-none editable-input" data-field="department_id">
                                            <option value="">Select Department</option>
                                            @foreach($departments as $dept)
                                                <option value="{{ $dept->department_id }}" {{ $member->department_id == $dept->department_id ? 'selected' : '' }}>
                                                    {{ $dept->department_name }}
                                                </option>
                                            @endforeach
                                        </select>
                                    @else
                                        <span class="editable-text text-muted">Not assigned</span>
                                        <select class="form-select form-select-sm d-none editable-input" data-field="department_id">
                                            <option value="">Select Department</option>
                                            @foreach($departments as $dept)
                                                <option value="{{ $dept->department_id }}">{{ $dept->department_name }}</option>
                                            @endforeach
                                        </select>
                                    @endif
                                </td>
                                <td class="px-4 py-3" data-field="email" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text">{{ $member->email ?? 'N/A' }}</span>
                                    <input type="email" class="form-control form-control-sm d-none editable-input" data-field="email" value="{{ $member->email ?? '' }}">
                                </td>
                                <td class="px-4 py-3" data-field="phone" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text">{{ $member->phone ?? 'N/A' }}</span>
                                    <input type="tel" class="form-control form-control-sm d-none editable-input" data-field="phone" value="{{ $member->phone ?? '' }}">
                                </td>
                                <td class="px-4 py-3" data-field="hire_date" data-faculty-id="{{ $member->faculty_id }}">
                                    <span class="editable-text">{{ $member->hire_date ? \Carbon\Carbon::parse($member->hire_date)->format('M d, Y') : 'N/A' }}</span>
                                    <input type="date" class="form-control form-control-sm d-none editable-input" data-field="hire_date" value="{{ $member->hire_date ? \Carbon\Carbon::parse($member->hire_date)->format('Y-m-d') : '' }}">
                                </td>
                                <td class="px-4 py-3">
                                    <!-- Edit Mode Buttons -->
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-primary btn-sm edit-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-success btn-sm save-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Save">
                                            <i class="fas fa-save"></i>
                                        </button>
                                        <button class="btn btn-danger btn-sm cancel-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Cancel">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    
                                    <!-- Archive Mode Buttons -->
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-warning btn-sm archive-row-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Archive Faculty">
                                            <i class="fas fa-archive"></i>
                                        </button>
                                        <button class="btn btn-outline-secondary btn-sm cancel-archive-btn d-none" data-faculty-id="{{ $member->faculty_id }}" title="Cancel Archive">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center mt-4">
        {{ $faculty->onEachSide(0)->links('vendor.pagination.simple-bootstrap-4') }}
    </div>
@else
    <div class="text-center py-5">
        <div class="mb-4">
            <i class="fas fa-chalkboard-teacher text-muted" style="font-size: 4rem;"></i>
        </div>
        <h4 class="text-muted">No Faculty Found</h4>
        <p class="text-muted">There are no faculty members to display at the moment.</p>
        <button type="button" class="btn btn-primary" id="addFacultyBtn">
            <i class="fas fa-plus me-2"></i>Add First Faculty Member
        </button>
    </div>
@endif
