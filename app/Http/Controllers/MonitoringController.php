<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use App\Models\Course;
use App\Models\Department;
use App\Models\Enrollment;
use App\Models\Faculty;
use App\Models\User;

class MonitoringController extends Controller
{
    public function dashboard()
    {
        return view('monitoring.dashboard');
    }

    public function account()
    {
        return view('monitoring.account');
    }

    public function reports()
    {
        return view('monitoring.reports');
    }

    public function getReportsData(Request $request)
    {
        try {
            $filters = $request->all();
            $departmentFilter = $filters['department'] ?? 'all';
            
            // Get basic counts
            $totalStudentsQuery = Student::where(function($query) {
                $query->where('is_active', 1)->orWhereNull('is_active');
            });
            
            // Apply department filter to total count if specified
            if ($departmentFilter !== 'all') {
                $totalStudentsQuery->whereHas('course', function($query) use ($departmentFilter) {
                    $query->where('department_id', $departmentFilter);
                });
            }
            
            $totalStudents = $totalStudentsQuery->count();
            
            $totalFaculty = Faculty::where(function($query) {
                $query->where('is_active', 1)->orWhereNull('is_active');
            })->count();
            
            $totalCourses = Course::where('is_active', '!=', 0)->count();
            $totalDepartments = Department::where('is_active', '!=', 0)->count();
            
            // Calculate enrollment rate (simplified)
            $enrollmentRate = $totalStudents > 0 ? ($totalStudents / ($totalStudents + 10)) * 100 : 0;
            
                            // Get detailed student data with filtering by department and sorting by year
                $studentsQuery = Student::where(function($query) {
                    $query->where('is_active', 1)->orWhereNull('is_active');
                })->with(['course.department']);
                
                // Apply department filter if specified
                if ($departmentFilter !== 'all') {
                    $studentsQuery->whereHas('course', function($query) use ($departmentFilter) {
                        $query->where('department_id', $departmentFilter);
                    });
                }
            
            // Sort by year, then by last_name, then by first_name
            $students = $studentsQuery->orderBy('year', 'asc')
                                   ->orderBy('last_name', 'asc')
                                   ->orderBy('first_name', 'asc')
                                   ->get()
                                   ->map(function($student) {
                                       // Calculate age from date_of_birth
                                       $age = null;
                                       if ($student->date_of_birth) {
                                           $age = \Carbon\Carbon::parse($student->date_of_birth)->age;
                                       }
                                       
                                       return [
                                           'student_id' => $student->student_id,
                                           'name' => trim($student->first_name . ' ' . $student->last_name),
                                           'age' => $age,
                                           'gender' => $student->gender,
                                           'contact_number' => $student->contact_number,
                                           'email_address' => $student->email_address,
                                           'year' => $student->year,
                                           'course_name' => $student->course ? $student->course->course_name : 'N/A',
                                           'department_name' => $student->course && $student->course->department ? $student->course->department->department_name : 'N/A',
                                           'is_active' => $student->is_active
                                       ];
                                   });
            
            $faculty = Faculty::where(function($query) {
                $query->where('is_active', 1)->orWhereNull('is_active');
            })->with(['department'])->limit(50)->get();
            
            $enrollments = Enrollment::with(['student', 'course.department'])->limit(50)->get();
            
            // Get statistics for charts
            $departmentDistribution = Department::selectRaw('departments.department_name, COUNT(students.student_id) as student_count')
                ->leftJoin('courses', 'departments.department_id', '=', 'courses.department_id')
                ->leftJoin('students', function($join) {
                    $join->on('courses.course_id', '=', 'students.course_id')
                         ->where(function($query) {
                             $query->where('students.is_active', 1)->orWhereNull('students.is_active');
                         });
                })
                ->where('departments.is_active', '!=', 0)
                ->groupBy('departments.department_id', 'departments.department_name')
                ->get();
            
            $courseEnrollment = Course::selectRaw('courses.course_name, COUNT(enrollments.enrollment_id) as enrollment_count')
                ->leftJoin('enrollments', 'courses.course_id', '=', 'enrollments.course_id')
                ->where('courses.is_active', '!=', 0)
                ->groupBy('courses.course_id', 'courses.course_name')
                ->limit(10)
                ->get();
            
            // Mock student growth data (you can replace this with real data)
            $studentGrowth = [
                ['month' => 'Jan', 'total_students' => $totalStudents - 20],
                ['month' => 'Feb', 'total_students' => $totalStudents - 15],
                ['month' => 'Mar', 'total_students' => $totalStudents - 10],
                ['month' => 'Apr', 'total_students' => $totalStudents - 5],
                ['month' => 'May', 'total_students' => $totalStudents],
            ];
            
            return response()->json([
                'success' => true,
                'summary' => [
                    'total_students' => $totalStudents,
                    'total_faculty' => $totalFaculty,
                    'total_courses' => $totalCourses,
                    'total_departments' => $totalDepartments,
                    'enrollment_rate' => round($enrollmentRate, 1)
                ],
                'details' => [
                    'students' => $students,
                    'faculty' => $faculty,
                    'enrollments' => $enrollments
                ],
                'statistics' => [
                    'department_distribution' => $departmentDistribution,
                    'course_enrollment' => $courseEnrollment,
                    'student_growth' => $studentGrowth
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error getting reports data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error loading report data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function students()
    {
        // Only show active students (is_active = 1 or null for backward compatibility)
        $students = Student::where(function($query) {
            $query->where('is_active', 1)->orWhereNull('is_active');
        })->with(['course.department'])->paginate(20);
        return view('monitoring.students', compact('students'));
    }

    public function courses()
    {
        $courses = Course::with(['department', 'enrollments'])->paginate(20);
        return view('monitoring.courses', compact('courses'));
    }

    public function departments()
    {
        $departments = Department::with(['courses', 'faculty'])->paginate(20);
        return view('monitoring.departments', compact('departments'));
    }

    public function enrollments()
    {
        $enrollments = Enrollment::with(['student', 'course'])->paginate(20);
        return view('monitoring.enrollments', compact('enrollments'));
    }

    public function faculty()
    {
        // Only show active faculty (is_active = 1 or null for backward compatibility)
        $faculty = Faculty::where(function($query) {
            $query->where('is_active', 1)->orWhereNull('is_active');
        })->with(['department'])->paginate(20);
        $departments = Department::all();
        return view('monitoring.faculty', compact('faculty', 'departments'));
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        $type = $request->get('type', 'all');

        if (!$query) {
            return response()->json(['results' => []]);
        }

        $results = [];

        if ($type === 'all' || $type === 'students') {
            $students = Student::where('first_name', 'like', "%{$query}%")
                ->orWhere('last_name', 'like', "%{$query}%")
                ->with('course.department')
                ->limit(5)
                ->get();
            $results['students'] = $students;
        }

        if ($type === 'all' || $type === 'courses') {
            $courses = Course::where('course_name', 'like', "%{$query}%")
                ->with('department')
                ->limit(5)
                ->get();
            $results['courses'] = $courses;
        }

        if ($type === 'all' || $type === 'faculty') {
            $faculty = Faculty::where('first_name', 'like', "%{$query}%")
                ->orWhere('last_name', 'like', "%{$query}%")
                ->with('department')
                ->limit(5)
                ->get();
            $results['faculty'] = $faculty;
        }

        return response()->json($results);
    }

    public function getCoursesByDepartment(Request $request)
    {
        $departmentId = $request->get('department_id');
        
        if (!$departmentId) {
            return response()->json(['courses' => []]);
        }

        try {
            // First try to find by department ID (if it's numeric)
            if (is_numeric($departmentId)) {
                $courses = Course::where('department_id', $departmentId)
                    ->where(function($q) {
                        $q->where('is_active', 1)->orWhereNull('is_active');
                    })
                    ->get();
            } else {
                // If it's a string (like "CSP"), try to find by department name
                $department = Department::where('department_name', $departmentId)->first();
                if ($department) {
                    $courses = Course::where('department_id', $department->department_id)
                        ->where(function($q) {
                            $q->where('is_active', 1)->orWhereNull('is_active');
                        })
                        ->get();
                } else {
                    $courses = collect(); // Empty collection if no department found
                }
            }
            
            // Get total faculty count for the department (since faculty belong to departments, not courses)
            $departmentFacultyCount = 0;
            if (is_numeric($departmentId)) {
                $departmentFacultyCount = Faculty::where('department_id', $departmentId)
                    ->where(function($query) {
                        $query->where('is_active', 1)->orWhereNull('is_active');
                    })
                    ->count();
            } else {
                $department = Department::where('department_name', $departmentId)->first();
                if ($department) {
                    $departmentFacultyCount = Faculty::where('department_id', $department->department_id)
                        ->where(function($query) {
                            $query->where('is_active', 1)->orWhereNull('is_active');
                        })
                        ->count();
                }
            }
            
            // Transform courses to include student counts and distribute faculty count among courses
            $coursesWithData = $courses->map(function($course) use ($departmentFacultyCount, $courses) {
                // Count students enrolled in this course (only active students)
                $studentCount = Enrollment::where('course_id', $course->course_id)
                    ->whereHas('student', function($query) {
                        $query->where(function($subQuery) {
                            $subQuery->where('is_active', 1)->orWhereNull('is_active');
                        });
                    })
                    ->count();
                
                // Distribute faculty count among courses (simple division)
                $facultyCount = $courses->count() > 0 ? round($departmentFacultyCount / $courses->count()) : 0;
                
                return [
                    'id' => $course->course_id,
                    'name' => $course->course_name,
                    'course_name' => $course->course_name,
                    'student_count' => $studentCount,
                    'students' => $studentCount,
                    'faculty_count' => $facultyCount,
                    'faculty' => $facultyCount,
                    'units' => $course->units,
                    'semester' => $course->semester,
                    'icon' => $this->getCourseIcon($course->course_name),
                    'color' => $this->getCourseColor($course->course_name)
                ];
            });
            
            // Debug logging
            \Log::info("getCoursesByDepartment called with: " . $departmentId . ", found " . $coursesWithData->count() . " courses with data");
            
            return response()->json(['courses' => $coursesWithData]);
        } catch (\Exception $e) {
            \Log::error("Error in getCoursesByDepartment: " . $e->getMessage());
            return response()->json(['courses' => [], 'error' => $e->getMessage()], 500);
        }
    }

    public function getDepartmentsData()
    {
        try {
            $departments = Department::with(['courses' => function($query) {
                $query->select('course_id', 'course_name', 'units', 'semester', 'department_id')
                    ->where(function($q) {
                        $q->where('is_active', 1)->orWhereNull('is_active');
                    });
            }])
            ->where(function($q) {
                $q->where('is_active', 1)->orWhereNull('is_active');
            })
            ->get()
            ->map(function($department) {
                $coursesWithStudents = $department->courses->map(function($course) {
                    // Only count enrollments from active (non-archived) students
                    $studentCount = Enrollment::where('course_id', $course->course_id)
                        ->whereHas('student', function($query) {
                            $query->where(function($subQuery) {
                                $subQuery->where('is_active', 1)->orWhereNull('is_active');
                            });
                        })
                        ->count();
                    
                    return [
                        'id' => $course->course_id,
                        'name' => $course->course_name,
                        'fullName' => $course->course_name,
                        'units' => $course->units,
                        'semester' => $course->semester,
                        'students' => $studentCount,
                        'icon' => $this->getCourseIcon($course->course_name),
                        'color' => $this->getCourseColor($course->course_name)
                    ];
                });
                $totalStudents = $coursesWithStudents->sum('students');
                
                // Only count active (non-archived) faculty
                $totalFaculty = Faculty::where('department_id', $department->department_id)
                    ->where(function($query) {
                        $query->where('is_active', 1)->orWhereNull('is_active');
                    })
                    ->count();
                    
                $totalEnrollments = $totalStudents;
                return [
                    'id' => $department->department_id,
                    'name' => $department->department_name,
                    'shortName' => $this->extractShortName($department->department_name),
                    'courses' => $coursesWithStudents,
                    'totalStudents' => $totalStudents,
                    'totalFaculty' => $totalFaculty,
                    'totalEnrollments' => $totalEnrollments
                ];
            });
            return response()->json(['success' => true, 'departments' => $departments]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error fetching departments data: ' . $e->getMessage()], 500);
        }
    }

    private function getCourseIcon($courseName)
    {
        $icons = [
            'BSIT' => 'fas fa-laptop-code',
            'BSCS' => 'fas fa-code',
            'BSLIB' => 'fas fa-book',
            'MULTIMEDIA' => 'fas fa-film',
            'BSBA' => 'fas fa-briefcase',
            'BSA' => 'fas fa-calculator',
            'BSCE' => 'fas fa-building',
            'BSEE' => 'fas fa-bolt'
        ];
        return $icons[$courseName] ?? 'fas fa-graduation-cap';
    }

    private function getCourseColor($courseName)
    {
        $colors = [
            'BSIT' => '#007bff',
            'BSCS' => '#28a745',
            'BSLIB' => '#ffc107',
            'MULTIMEDIA' => '#dc3545',
            'BSBA' => '#6f42c1',
            'BSA' => '#fd7e14',
            'BSCE' => '#20c997',
            'BSEE' => '#e83e8c'
        ];
        return $colors[$courseName] ?? '#6c757d';
    }

    private function extractShortName($departmentName)
    {
        $words = explode(' ', $departmentName);
        $shortName = '';
        foreach ($words as $word) {
            $shortName .= strtoupper(substr($word, 0, 1));
        }
        return $shortName;
    }

    public function addStudent(Request $request)
    {
        try {
            // Debug: Log the incoming request data
            \Log::info('Add Student Request Data:', $request->all());
            
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'gender' => 'required|in:Male,Female,Other',
                'date_of_birth' => 'required|date',
                'address' => 'required|string',
                'course_id' => 'required|exists:courses,course_id',
                'year' => 'required|string'
            ]);

            // Create the student (student_id will auto-increment)
            $student = Student::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
                'course_id' => $request->course_id,
                'year' => $request->year
            ]);

            // The Student model's static::created event will automatically create the enrollment

            return response()->json([
                'success' => true,
                'message' => 'Student added successfully with ID: ' . $student->student_id,
                'student' => $student
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error adding student: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStudent(Request $request, Student $student)
    {
        try {
            // Dynamic validation based on what fields are being updated
            $validationRules = [];
            $updateData = [];
            
            // Only validate and update fields that are present in the request
            if ($request->has('student_id')) {
                $validationRules['student_id'] = 'required|string|max:255|unique:students,student_id,' . $student->id . ',id';
                $updateData['student_id'] = $request->student_id;
            }
            
            if ($request->has('first_name')) {
                $validationRules['first_name'] = 'required|string|max:255';
                $updateData['first_name'] = $request->first_name;
            }
            
            if ($request->has('last_name')) {
                $validationRules['last_name'] = 'required|string|max:255';
                $updateData['last_name'] = $request->last_name;
            }
            
            if ($request->has('gender')) {
                $validationRules['gender'] = 'required|in:Male,Female,Other';
                $updateData['gender'] = $request->gender;
            }
            
            if ($request->has('date_of_birth')) {
                $validationRules['date_of_birth'] = 'required|date';
                $updateData['date_of_birth'] = $request->date_of_birth;
            }
            
            if ($request->has('address')) {
                $validationRules['address'] = 'required|string';
                $updateData['address'] = $request->address;
            }
            
            if ($request->has('course_id')) {
                $validationRules['course_id'] = 'required|exists:courses,course_id';
                $updateData['course_id'] = $request->course_id;
            }
            
            if ($request->has('year')) {
                $validationRules['year'] = 'required|string';
                $updateData['year'] = $request->year;
            }
            
            // Validate only the fields being updated
            if (!empty($validationRules)) {
                $request->validate($validationRules);
            }
            
            // Update only the fields that were provided
            if (!empty($updateData)) {
                $student->update($updateData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Student updated successfully!',
                'student' => $student
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating student: ' . $e->getMessage()
            ], 500);
        }
    }





    public function getStudent(Student $student)
    {
        try {
            \Log::info("Fetching student with ID: " . $student->id);
            
            // Check if user is authenticated
            if (!auth()->check()) {
                \Log::warning("User not authenticated");
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }
            
            $student = $student->load(['course.department']);
            
            \Log::info("Student found: " . ($student ? 'yes' : 'no'));
            
            if (!$student) {
                \Log::warning("Student not found with ID: " . $id);
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found'
                ], 404);
            }

            \Log::info("Student data: " . json_encode($student->toArray()));
            
            // Ensure we're returning JSON
            return response()->json([
                'success' => true,
                'student' => $student
            ])->header('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            \Log::error("Error fetching student: " . $e->getMessage());
            \Log::error("Stack trace: " . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching student data: ' . $e->getMessage()
            ], 500)->header('Content-Type', 'application/json');
        }
    }

    public function addFaculty(Request $request)
    {
        try {
            // Check if user is authenticated
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Validate the request
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'gender' => 'nullable|in:Male,Female,Other',
                'date_of_birth' => 'nullable|date',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'department_id' => 'nullable|exists:departments,department_id',
                'hire_date' => 'nullable|date'
            ]);

            // Create the faculty member
            $faculty = Faculty::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender ?: null,
                'date_of_birth' => $request->date_of_birth ?: null,
                'email' => $request->email ?: null,
                'phone' => $request->phone ?: null,
                'department_id' => $request->department_id ?: null,
                'hire_date' => $request->hire_date ?: null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Faculty member added successfully with ID: ' . $faculty->faculty_id,
                'faculty' => $faculty
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error adding faculty member: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateFaculty(Request $request, $facultyId)
    {
        try {
            // Check if user is authenticated
            if (!auth()->check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Find the faculty member
            $faculty = Faculty::find($facultyId);
            if (!$faculty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty member not found'
                ], 404);
            }

            // Prepare validation rules and update data
            $validationRules = [];
            $updateData = [];

            if ($request->has('first_name')) {
                $validationRules['first_name'] = 'required|string|max:255';
                $updateData['first_name'] = $request->first_name;
            }

            if ($request->has('last_name')) {
                $validationRules['last_name'] = 'required|string|max:255';
                $updateData['last_name'] = $request->last_name;
            }

            if ($request->has('gender')) {
                $validationRules['gender'] = 'nullable|in:Male,Female,Other';
                $updateData['gender'] = $request->gender ?: null;
            }

            if ($request->has('date_of_birth')) {
                $validationRules['date_of_birth'] = 'nullable|date';
                $updateData['date_of_birth'] = $request->date_of_birth ?: null;
            }

            if ($request->has('department_id')) {
                $validationRules['department_id'] = 'nullable|exists:departments,department_id';
                $updateData['department_id'] = $request->department_id ?: null;
            }

            if ($request->has('email')) {
                $validationRules['email'] = 'nullable|email|max:255';
                $updateData['email'] = $request->email ?: null;
            }

            if ($request->has('phone')) {
                $validationRules['phone'] = 'nullable|string|max:20';
                $updateData['phone'] = $request->phone ?: null;
            }

            if ($request->has('hire_date')) {
                $validationRules['hire_date'] = 'nullable|date';
                $updateData['hire_date'] = $request->hire_date ?: null;
            }

            // Validate only the fields being updated
            if (!empty($validationRules)) {
                $request->validate($validationRules);
            }

            // Update only the fields that were provided
            if (!empty($updateData)) {
                $faculty->update($updateData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Faculty member updated successfully!',
                'faculty' => $faculty
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating faculty member: ' . $e->getMessage()
            ], 500);
        }
    }

    public function settings()
    {
        try {
            // Add debugging
            \Log::info('Settings method called');
            
            // Get statistics for the settings page
            $coursesCount = Course::count();
            $activeCoursesCount = Course::count(); // All courses are considered active for now
            $archivedCoursesCount = 0; // No archive functionality yet
            $departmentsCount = Department::count();
            $activeDepartmentsCount = Department::count(); // All departments are considered active for now
            $archivedDepartmentsCount = 0; // No archive functionality yet
            
            // Student archive statistics
            $archivedStudentsCount = Student::where('is_active', false)->count();
            $recentlyArchivedCount = Student::where('is_active', false)
                ->where('updated_at', '>=', now()->subDays(30))
                ->count();
            $restoredStudentsCount = 0; // You can implement this based on your needs
            $permanentlyDeletedCount = 0; // You can implement this based on your needs
            
            // Faculty archive statistics
            $archivedFacultyCount = Faculty::where('is_active', false)->count();
            $recentlyArchivedFacultyCount = Faculty::where('is_active', false)
                ->where('updated_at', '>=', now()->subDays(30))
                ->count();
            $restoredFacultyCount = 0; // You can implement this based on your needs
            $permanentlyDeletedFacultyCount = 0; // You can implement this based on your needs;

            // Get departments for filter dropdowns
            $departments = Department::orderBy('department_name')->get();
            
            // Debug: Log department data
            \Log::info('Departments loaded for settings:', [
                'count' => $departments->count(),
                'departments' => $departments->pluck('department_name', 'department_id')->toArray()
            ]);
            
            // Also log to console for immediate debugging
            \Log::info('Department query result:', [
                'sql' => Department::orderBy('department_name')->toSql(),
                'bindings' => Department::orderBy('department_name')->getBindings()
            ]);
            
            return view('monitoring.settings', compact(
                'coursesCount',
                'activeCoursesCount',
                'archivedCoursesCount',
                'departmentsCount',
                'activeDepartmentsCount',
                'archivedDepartmentsCount',
                'archivedStudentsCount',
                'recentlyArchivedCount',
                'restoredStudentsCount',
                'permanentlyDeletedCount',
                'archivedFacultyCount',
                'recentlyArchivedFacultyCount',
                'restoredFacultyCount',
                'permanentlyDeletedFacultyCount',
                'departments'
            ));
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Settings page error: ' . $e->getMessage());
            
            // Return view with default values if there's an error
            return view('monitoring.settings', [
                'coursesCount' => 0,
                'activeCoursesCount' => 0,
                'archivedCoursesCount' => 0,
                'departmentsCount' => 0,
                'activeDepartmentsCount' => 0,
                'archivedDepartmentsCount' => 0,
                'archivedStudentsCount' => 0,
                'recentlyArchivedCount' => 0,
                'restoredStudentsCount' => 0,
                'permanentlyDeletedCount' => 0,
                'archivedFacultyCount' => 0,
                'recentlyArchivedFacultyCount' => 0,
                'restoredFacultyCount' => 0,
                'permanentlyDeletedFacultyCount' => 0,
                'departments' => collect([])
            ]);
        }
    }

    /**
     * Archive a student (set is_active to 0)
     */
    public function archiveStudent(Request $request, $studentId)
    {
        try {
            $student = Student::where('student_id', $studentId)->first();
            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found'
                ], 404);
            }
            
            $student->update(['is_active' => 0]);
            
            return response()->json([
                'success' => true,
                'message' => 'Student archived successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error archiving student: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error archiving student'
            ], 500);
        }
    }

    /**
     * Get archived students for the settings page
     */
    public function getArchivedStudents()
    {
        try {
            // Get students with is_active = 0 (archived)
            $archivedStudents = Student::where('is_active', 0)
                ->with(['course.department'])
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->student_id,
                        'student_id' => $student->student_id,
                        'first_name' => $student->first_name,
                        'last_name' => $student->last_name,
                        'department' => $student->course && $student->course->department ? $student->course->department->department_name : 'Unassigned',
                        'course' => $student->course ? $student->course->course_name : 'Unassigned',
                        'gender' => $student->gender,
                        'date_of_birth' => $student->date_of_birth ? \Carbon\Carbon::parse($student->date_of_birth)->format('M d, Y') : 'N/A',
                        'address' => $student->address,
                        'year' => $student->year,
                        'archived_date' => $student->updated_at ? $student->updated_at->format('M d, Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $archivedStudents
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived students: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching archived students'
            ], 500);
        }
    }

    /**
     * Restore an archived student
     */
    public function restoreStudent($id)
    {
        try {
            $student = Student::where('student_id', $id)->first();
            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found'
                ], 404);
            }
            
            $student->update(['is_active' => 1]);
            
            return response()->json([
                'success' => true,
                'message' => 'Student restored successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error restoring student: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error restoring student'
            ], 500);
        }
    }

    /**
     * Permanently delete an archived student
     */
    public function deleteStudent($id)
    {
        try {
            $student = Student::where('student_id', $id)->first();
            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found'
                ], 404);
            }
            
            $student->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Student permanently deleted'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting student: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting student'
            ], 500);
        }
    }

    /**
     * Archive a faculty member (set is_active to 0)
     */
    public function archiveFaculty(Request $request, $facultyId)
    {
        try {
            $faculty = Faculty::where('faculty_id', $facultyId)->first();
            if (!$faculty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty not found'
                ], 404);
            }
            
            $faculty->update(['is_active' => 0]);
            
            return response()->json([
                'success' => true,
                'message' => 'Faculty archived successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error archiving faculty: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error archiving faculty'
            ], 500);
        }
    }

    /**
     * Get archived faculty for the settings page
     */
    public function getArchivedFaculty()
    {
        try {
            // Get faculty with is_active = 0 (archived)
            $archivedFaculty = Faculty::where('is_active', 0)
                ->with(['department'])
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($faculty) {
                    return [
                        'id' => $faculty->faculty_id,
                        'faculty_id' => $faculty->faculty_id,
                        'first_name' => $faculty->first_name,
                        'last_name' => $faculty->last_name,
                        'department' => $faculty->department ? $faculty->department->department_name : 'Unassigned',
                        'email' => $faculty->email,
                        'phone' => $faculty->phone,
                        'gender' => $faculty->gender,
                        'date_of_birth' => $faculty->date_of_birth ? \Carbon\Carbon::parse($faculty->date_of_birth)->format('M d, Y') : 'N/A',
                        'hire_date' => $faculty->hire_date ? \Carbon\Carbon::parse($faculty->hire_date)->format('M d, Y') : 'N/A',
                        'archived_date' => $faculty->updated_at ? $faculty->updated_at->format('M d, Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $archivedFaculty
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived faculty: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching archived faculty'
            ], 500);
        }
    }

    /**
     * Restore a faculty member (set is_active to 1)
     */
    public function restoreFaculty($id)
    {
        try {
            $faculty = Faculty::where('faculty_id', $id)->first();
            if (!$faculty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty not found'
                ], 404);
            }
            
            $faculty->update(['is_active' => 1]);
            
            return response()->json([
                'success' => true,
                'message' => 'Faculty restored successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error restoring faculty: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error restoring faculty'
            ], 500);
        }
    }

    // Course Management Methods
    /**
     * Get all active courses
     */
    public function getCourses()
    {
        try {
            $courses = Course::where('is_active', 1)
                ->orWhereNull('is_active')
                ->with(['department'])
                ->orderBy('course_name')
                ->get();

            return response()->json($courses);
        } catch (\Exception $e) {
            \Log::error('Error fetching courses: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching courses'
            ], 500);
        }
    }

    /**
     * Get a single course by ID
     */
    public function getCourse($id)
    {
        try {
            $course = Course::where('course_id', $id)->with('department')->first();
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }
            return response()->json($course);
        } catch (\Exception $e) {
            \Log::error('Error fetching course: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 500);
        }
    }

    /**
     * Add a new course
     */
    public function addCourse(Request $request)
    {
        try {
            $request->validate([
                'course_code' => 'required|string|max:20|unique:courses,course_code',
                'course_name' => 'required|string|max:255',
                'department_id' => 'required|exists:departments,department_id',
                'credits' => 'required|integer|min:1|max:30'
            ]);

            $course = Course::create([
                'course_code' => $request->course_code,
                'course_name' => $request->course_name,
                'department_id' => $request->department_id,
                'credits' => $request->credits,
                'is_active' => 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Course added successfully',
                'course' => $course->load('department')
            ]);
        } catch (\Exception $e) {
            \Log::error('Error adding course: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error adding course: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing course
     */
    public function updateCourse(Request $request, $id)
    {
        try {
            // Log the incoming data for debugging
            \Log::info('Updating course ' . $id . ' with data: ' . json_encode($request->all()));
            
            $request->validate([
                'course_code' => 'required|string|max:20',
                'course_name' => 'required|string|max:255',
                'department_id' => 'required|integer|exists:departments,department_id',
                'credits' => 'required|integer|min:1|max:30'
            ]);

            $course = Course::where('course_id', $id)->first();
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }
            
            $course->update([
                'course_code' => $request->course_code,
                'course_name' => $request->course_name,
                'department_id' => $request->department_id,
                'credits' => $request->credits
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Course updated successfully',
                'course' => $course->load('department')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error updating course: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating course: ' . $e->getMessage());
            \Log::error('Exception class: ' . get_class($e));
            \Log::error('Exception trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error updating course: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Archive a course (set is_active to 0)
     */
    public function archiveCourse(Request $request, $id)
    {
        try {
            $course = Course::where('course_id', $id)->first();
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }
            
            $course->update(['is_active' => 0]);
            
            return response()->json([
                'success' => true,
                'message' => 'Course archived successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error archiving course: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error archiving course'
            ], 500);
        }
    }

    /**
     * Restore a course (set is_active to 1)
     */
    public function restoreCourse($id)
    {
        try {
            $course = Course::where('course_id', $id)->first();
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }
            
            $course->update(['is_active' => 1]);
            
            return response()->json([
                'success' => true,
                'message' => 'Course restored successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error restoring course: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error restoring course'
            ], 500);
        }
    }

    /**
     * Get archived courses
     */
    public function getArchivedCourses()
    {
        try {
            $archivedCourses = Course::where('is_active', 0)
                ->with(['department'])
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($course) {
                    return [
                        'id' => $course->course_id,
                        'course_id' => $course->course_id,
                        'course_code' => $course->course_code,
                        'course_name' => $course->course_name,
                        'department' => $course->department ? $course->department->department_name : 'Unassigned',
                        'credits' => $course->credits,
                        'archived_date' => $course->updated_at ? $course->updated_at->format('M d, Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $archivedCourses
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived courses: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching archived courses'
            ], 500);
        }
    }

    // Department Management Methods
    /**
     * Get all active departments
     */
    public function getDepartments()
    {
        try {
            $departments = Department::where('is_active', 1)
                ->orWhereNull('is_active')
                ->orderBy('department_name')
                ->get();

            return response()->json($departments);
        } catch (\Exception $e) {
            \Log::error('Error fetching departments: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching departments'
            ], 500);
        }
    }

    /**
     * Get a single department by ID
     */
    public function getDepartment($id)
    {
        try {
            $department = Department::where('department_id', $id)->first();
            if (!$department) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found'
                ], 404);
            }
            return response()->json($department);
        } catch (\Exception $e) {
            \Log::error('Error fetching department: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Department not found'
            ], 500);
        }
    }

    /**
     * Add a new department
     */
    public function addDepartment(Request $request)
    {
        try {
            $request->validate([
                'department_code' => 'required|string|max:20|unique:departments,department_code',
                'department_name' => 'required|string|max:255|unique:departments,department_name',
                'description' => 'nullable|string|max:500'
            ]);

            $department = Department::create([
                'department_code' => $request->department_code,
                'department_name' => $request->department_name,
                'description' => $request->description,
                'is_active' => 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Department added successfully',
                'department' => $department
            ]);
        } catch (\Exception $e) {
            \Log::error('Error adding department: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error adding department: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing department
     */
    public function updateDepartment(Request $request, $id)
    {
        try {
            $request->validate([
                'department_code' => 'required|string|max:20|unique:departments,department_code,' . $id . ',department_id',
                'department_name' => 'required|string|max:255|unique:departments,department_name,' . $id . ',department_id',
                'description' => 'nullable|string|max:500'
            ]);

            $department = Department::where('department_id', $id)->first();
            if (!$department) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found'
                ], 404);
            }
            
            $department->update([
                'department_code' => $request->department_code,
                'department_name' => $request->department_name,
                'description' => $request->description
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Department updated successfully',
                'department' => $department
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating department: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating department: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Archive a department (set is_active to 0)
     */
    public function archiveDepartment(Request $request, $id)
    {
        try {
            $department = Department::where('department_id', $id)->first();
            if (!$department) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found'
                ], 404);
            }
            
            $department->update(['is_active' => 0]);

            return response()->json([
                'success' => true,
                'message' => 'Department archived successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error archiving department: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error archiving department'
            ], 500);
        }
    }

    /**
     * Restore a department (set is_active to 1)
     */
    public function restoreDepartment($id)
    {
        try {
            $department = Department::where('department_id', $id)->first();
            if (!$department) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found'
                ], 404);
            }
            
            $department->update(['is_active' => 1]);

            return response()->json([
                'success' => true,
                'message' => 'Department restored successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error restoring department: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error restoring department'
            ], 500);
        }
    }

    /**
     * Get archived departments
     */
    public function getArchivedDepartments()
    {
        try {
            $archivedDepartments = Department::where('is_active', 0)
                ->orderBy('updated_at', 'desc')
                ->get()
                ->map(function ($department) {
                    return [
                        'id' => $department->department_id,
                        'department_id' => $department->department_id,
                        'department_code' => $department->department_code,
                        'department_name' => $department->department_name,
                        'description' => $department->description,
                        'archived_date' => $department->updated_at ? $department->updated_at->format('M d, Y') : 'Unknown'
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $archivedDepartments
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching archived departments: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching archived departments'
            ], 500);
        }
    }

    /**
     * Get department statistics
     */
    public function getDepartmentStats()
    {
        try {
            $total = Department::count();
            $active = Department::where('is_active', 1)->orWhereNull('is_active')->count();
            $archived = Department::where('is_active', 0)->count();

            return response()->json([
                'success' => true,
                'total' => $total,
                'active' => $active,
                'archived' => $archived
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching department stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching department stats'
            ], 500);
        }
    }

    /**
     * Get course statistics
     */
    public function getCourseStats()
    {
        try {
            $total = Course::count();
            $active = Course::where('is_active', 1)->orWhereNull('is_active')->count();
            $archived = Course::where('is_active', 0)->count();

            return response()->json([
                'success' => true,
                'total' => $total,
                'active' => $active,
                'archived' => $archived
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching course stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching course stats'
            ], 500);
        }
    }

    /**
     * Get all faculty members
     */
    public function getFaculty()
    {
        try {
            $faculty = Faculty::with('department')->get();
            return response()->json($faculty);
        } catch (\Exception $e) {
            \Log::error('Error fetching faculty: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching faculty'
            ], 500);
        }
    }

    /**
     * Get a single faculty member by ID
     */
    public function getFacultyMember($id)
    {
        try {
            $faculty = Faculty::with('department')->findOrFail($id);
            return response()->json($faculty);
        } catch (\Exception $e) {
            \Log::error('Error fetching faculty member: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Faculty member not found'
            ], 404);
        }
    }

    /**
     * Get faculty statistics
     */
    public function getFacultyStats()
    {
        try {
            $total = Faculty::count();
            $active = Faculty::where('is_active', 1)->orWhereNull('is_active')->count();
            $archived = Faculty::where('is_active', 0)->count();

            return response()->json([
                'success' => true,
                'total' => $total,
                'active' => $active,
                'archived' => $archived
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching faculty stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching faculty stats'
            ], 500);
        }
    }

    /**
     * Get all students
     */
    public function getStudents()
    {
        try {
            $students = Student::with(['course.department'])->get();
            return response()->json($students);
        } catch (\Exception $e) {
            \Log::error('Error fetching students: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching students'
            ], 500);
        }
    }

    /**
     * Get student statistics
     */
    public function getStudentStats()
    {
        try {
            $total = Student::count();
            $active = Student::where('is_active', 1)->orWhereNull('is_active')->count();
            $archived = Student::where('is_active', 0)->count();

            return response()->json([
                'success' => true,
                'total' => $total,
                'active' => $active,
                'archived' => $archived
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching student stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching student stats'
            ], 500);
        }
    }

    /**
     * Get student archive statistics
     */
    public function getStudentArchiveStats()
    {
        try {
            $archived = Student::where('is_active', 0)->count();
            return response()->json([
                'success' => true,
                'archived' => $archived
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching student archive stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching student archive stats'
            ], 500);
        }
    }

    /**
     * Get faculty archive statistics
     */
    public function getFacultyArchiveStats()
    {
        try {
            $archived = Faculty::where('is_active', 0)->count();
            return response()->json([
                'success' => true,
                'archived' => $archived
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching faculty archive stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching faculty archive stats'
            ], 500);
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'username' => 'nullable|string|max:255|unique:users,username,' . auth()->id() . ',user_id',
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
            ]);

            $user = auth()->user();
            
            $user->update([
                'username' => $request->username,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6',
                'confirm_password' => 'required|same:new_password',
            ]);

            $user = auth()->user();
            
            // Check if current password matches
            if (!password_verify($request->current_password, $user->password_hash)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            // Update password
            $user->update([
                'password_hash' => password_hash($request->new_password, PASSWORD_DEFAULT)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error changing password: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error changing password: ' . $e->getMessage()
            ], 500);
        }
    }
}
