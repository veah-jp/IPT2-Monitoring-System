<div class="row mb-4">
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="fas fa-search text-muted"></i>
                    </span>
                    <input type="text" class="form-control border-start-0" placeholder="Search Students" id="studentSearch">
                </div>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="departmentFilter">
                    <option value="">Filter by Department</option>
                </select>
            </div>
            <div class="col-md-3" id="courseFilterContainer" style="display: none;">
                <select class="form-select" id="courseFilter">
                    <option value="">Filter by Course</option>
                </select>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-12">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary" id="addStudentsBtn">
                        <i class="fas fa-plus me-2"></i>Add Students
                    </button>
                    <button type="button" class="btn btn-outline-secondary" id="editSelectedBtn">
                        <i class="fas fa-user-edit me-2"></i>Edit Student
                    </button>
                    <button type="button" class="btn btn-outline-info" id="archiveStudentsBtn">
                        <i class="fas fa-archive me-2"></i>Archive Students
                    </button>
                </div>
            </div>
        </div>

        @include('monitoring.partials.students-modals')

        <div class="card">
            <div class="card-body p-0">
                @if($students->count() > 0)
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="border-0 px-4 py-3">Students ID</th>
                                    <th class="border-0 px-4 py-3">First Name</th>
                                    <th class="border-0 px-4 py-3">Last Name</th>
                                    <th class="border-0 px-4 py-3">Course</th>
                                    <th class="border-0 px-4 py-3">Department</th>
                                    <th class="border-0 px-4 py-3">Gender</th>
                                    <th class="border-0 px-4 py-3">Date of Birth</th>
                                    <th class="border-0 px-4 py-3">Address</th>
                                    <th class="border-0 px-4 py-3">Year</th>
                                    <th class="border-0 px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($students as $student)
                                    <tr class="border-bottom">
                                        <td class="px-4 py-3">
                                            <strong>{{ $student->student_id ?? 'N/A' }}</strong>
                                        </td>
                                        <td class="px-4 py-3" data-field="first_name" data-student-id="{{ $student->student_id }}">
                                            <span class="editable-text">{{ $student->first_name }}</span>
                                            <input type="text" class="form-control form-control-sm d-none editable-input" value="{{ $student->first_name }}">
                                        </td>
                                        <td class="px-4 py-3" data-field="last_name" data-student-id="{{ $student->student_id }}">
                                            <span class="editable-text">{{ $student->last_name }}</span>
                                            <input type="text" class="form-control form-control-sm d-none editable-input" value="{{ $student->last_name }}">
                                        </td>
                                        <td class="px-4 py-3" data-field="course_id" data-student-id="{{ $student->student_id }}">
                                            @if($student->course)
                                                <span class="editable-text badge bg-success">{{ $student->course->course_name }}</span>
                                                <select class="form-select form-select-sm d-none editable-input">
                                                    <option value="">Select Course</option>
                                                    <option value="1" {{ $student->course_id == 1 ? 'selected' : '' }}>BSIT</option>
                                                    <option value="2" {{ $student->course_id == 2 ? 'selected' : '' }}>BSCE</option>
                                                    <option value="3" {{ $student->course_id == 3 ? 'selected' : '' }}>BSSS</option>
                                                </select>
                                            @else
                                                <span class="editable-text text-muted">Not assigned</span>
                                                <select class="form-select form-select-sm d-none editable-input">
                                                    <option value="">Select Course</option>
                                                    <option value="1">BSIT</option>
                                                    <option value="2">BSCE</option>
                                                    <option value="3">BSSS</option>
                                                </select>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3" data-field="department_id" data-student-id="{{ $student->student_id }}">
                                            @if($student->course && $student->course->department)
                                                <span class="editable-text badge bg-primary">{{ $student->course->department->department_name }}</span>
                                                <select class="form-select form-select-sm d-none editable-input">
                                                    <option value="">Select Department</option>
                                                    <option value="1" {{ $student->course && $student->course->department_id == 1 ? 'selected' : '' }}>CSP</option>
                                                    <option value="2" {{ $student->course && $student->course->department_id == 2 ? 'selected' : '' }}>Engineering</option>
                                                    <option value="3" {{ $student->course && $student->course->department_id == 3 ? 'selected' : '' }}>BAP</option>
                                                    <option value="4" {{ $student->course && $student->course->department_id == 4 ? 'selected' : '' }}>ASP</option>
                                                </select>
                                            @else
                                                <span class="editable-text text-muted">Not assigned</span>
                                                <select class="form-select form-select-sm d-none editable-input">
                                                    <option value="">Select Department</option>
                                                    <option value="1">CSP</option>
                                                    <option value="2">Engineering</option>
                                                    <option value="3">BAP</option>
                                                    <option value="4">ASP</option>
                                                </select>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3" data-field="gender" data-student-id="{{ $student->student_id }}">
                                            <span class="editable-text badge bg-secondary">{{ $student->gender ?? 'N/A' }}</span>
                                            <select class="form-select form-select-sm d-none editable-input">
                                                <option value="">Select Gender</option>
                                                <option value="Male" {{ $student->gender == 'Male' ? 'selected' : '' }}>Male</option>
                                                <option value="Female" {{ $student->gender == 'Female' ? 'selected' : '' }}>Female</option>
                                                <option value="Other" {{ $student->gender == 'Other' ? 'selected' : '' }}>Other</option>
                                            </select>
                                        </td>
                                        <td class="px-4 py-3" data-field="date_of_birth" data-student-id="{{ $student->student_id }}">
                                            <span class="editable-text">{{ $student->date_of_birth ? \Carbon\Carbon::parse($student->date_of_birth)->format('M d, Y') : 'N/A' }}</span>
                                            <input type="date" class="form-control form-control-sm d-none editable-input" value="{{ $student->date_of_birth ? \Carbon\Carbon::parse($student->date_of_birth)->format('Y-m-d') : '' }}">
                                        </td>
                                        <td class="px-4 py-3" data-field="address" data-student-id="{{ $student->student_id }}">
                                            <span class="editable-text text-truncate d-inline-block" style="max-width: 150px;" title="{{ $student->address ?? 'N/A' }}">
                                                {{ $student->address ?? 'N/A' }}
                                            </span>
                                            <textarea class="form-control form-control-sm d-none editable-input" rows="2" style="max-width: 150px;">{{ $student->address ?? '' }}</textarea>
                                        </td>
                                        <td class="px-4 py-3" data-field="year" data-student-id="{{ $student->student_id }}">
                                            <span class="editable-text badge bg-info">{{ $student->year ?? 'N/A' }}</span>
                                            <select class="form-select form-select-sm d-none editable-input">
                                                <option value="">Select Year</option>
                                                <option value="1st Year" {{ $student->year == '1st Year' ? 'selected' : '' }}>1st Year</option>
                                                <option value="2nd Year" {{ $student->year == '2nd Year' ? 'selected' : '' }}>2nd Year</option>
                                                <option value="3rd Year" {{ $student->year == '3rd Year' ? 'selected' : '' }}>3rd Year</option>
                                                <option value="4th Year" {{ $student->year == '4th Year' ? 'selected' : '' }}>4th Year</option>
                                            </select>
                                        </td>
                                        <td class="px-4 py-3">
                                            <button type="button" class="btn btn-sm btn-outline-primary edit-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-success save-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                <i class="fas fa-save"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-secondary cancel-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                <i class="fas fa-times"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-warning archive-row-btn d-none" data-student-id="{{ $student->student_id }}">
                                                <i class="fas fa-archive"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-secondary cancel-archive-btn d-none" data-student-id="{{ $student->student_id }}">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <div class="text-center py-5">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <h5 class="text-muted">No students found in the system.</h5>
                        <p class="text-muted">Start by adding some students to get started.</p>
                    </div>
                @endif
            </div>
        </div>

        @if($students->count() > 0)
            <div class="d-flex justify-content-center mt-4">
                {{ $students->onEachSide(0)->links('vendor.pagination.simple-bootstrap-4') }}
            </div>
        @endif


