<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

try {
    echo "=== CHECKING STUDENTS AND COURSES ALIGNMENT ===\n\n";
    
    // Get all students with their course and department info
    $students = DB::table('students')
        ->leftJoin('courses', 'students.course_id', '=', 'courses.course_id')
        ->leftJoin('departments', 'courses.department_id', '=', 'departments.department_id')
        ->select('students.student_id', 'students.first_name', 'students.last_name', 
                'students.course_id', 'courses.course_name', 'departments.department_name')
        ->get();
    
    echo "Total Students: " . $students->count() . "\n\n";
    
    // Check for students with invalid course_id
    $invalidCourseStudents = $students->where('course_name', null);
    echo "Students with INVALID course_id: " . $invalidCourseStudents->count() . "\n";
    foreach ($invalidCourseStudents as $student) {
        echo "  - {$student->first_name} {$student->last_name} (ID: {$student->student_id}) - Course ID: {$student->course_id} (INVALID)\n";
    }
    
    echo "\n=== CURRENT DEPARTMENT DISTRIBUTION ===\n";
    $departmentCounts = $students->where('department_name', '!=', null)
        ->groupBy('department_name')
        ->map(function($group) { return $group->count(); });
    
    foreach ($departmentCounts as $dept => $count) {
        echo "  {$dept}: {$count} students\n";
    }
    
    echo "\n=== AVAILABLE COURSES BY DEPARTMENT ===\n";
    $courses = DB::table('courses')
        ->join('departments', 'courses.department_id', '=', 'departments.department_id')
        ->select('courses.course_id', 'courses.course_name', 'departments.department_name')
        ->get();
    
    $coursesByDept = $courses->groupBy('department_name');
    foreach ($coursesByDept as $dept => $deptCourses) {
        echo "  {$dept}:\n";
        foreach ($deptCourses as $course) {
            echo "    - {$course->course_name} (ID: {$course->course_id})\n";
        }
        echo "\n";
    }
    
    echo "\n=== RECOMMENDED ACTIONS ===\n";
    if ($invalidCourseStudents->count() > 0) {
        echo "1. Fix students with invalid course_id\n";
        echo "2. Redistribute students to Engineering and BAP departments\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
