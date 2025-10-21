<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

try {
    echo "=== FIXING STUDENT DISTRIBUTION ===\n\n";
    
    // First, let's see the current state
    echo "Current state:\n";
    $studentsCount = DB::table('students')->count();
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "- Students table: {$studentsCount} records\n";
    echo "- Enrollments table: {$enrollmentsCount} records\n\n";
    
    // Get available courses for Engineering (department_id = 2) and BAP (department_id = 3)
    $engineeringCourses = DB::table('courses')->where('department_id', 2)->get();
    $bapCourses = DB::table('courses')->where('department_id', 3)->get();
    
    echo "Available courses:\n";
    echo "- Engineering (ID: 2): " . $engineeringCourses->count() . " courses\n";
    foreach ($engineeringCourses as $course) {
        echo "  * {$course->course_name} (ID: {$course->course_id})\n";
    }
    
    echo "- BAP (ID: 3): " . $bapCourses->count() . " courses\n";
    foreach ($bapCourses as $course) {
        echo "  * {$course->course_name} (ID: {$course->course_id})\n";
    }
    
    // Get students with invalid or missing course_id
    $invalidCourseStudents = DB::table('students')
        ->leftJoin('courses', 'students.course_id', '=', 'courses.course_id')
        ->whereNull('courses.course_id')
        ->orWhere('students.course_id', null)
        ->select('students.student_id', 'students.first_name', 'students.last_name', 'students.course_id')
        ->get();
    
    echo "\nStudents with invalid/missing course_id: " . $invalidCourseStudents->count() . "\n";
    
    if ($invalidCourseStudents->count() > 0) {
        echo "Fixing course assignments...\n";
        
        // Distribute students to Engineering and BAP courses
        $engineeringCourseIds = $engineeringCourses->pluck('course_id')->toArray();
        $bapCourseIds = $bapCourses->pluck('course_id')->toArray();
        
        $allCourseIds = array_merge($engineeringCourseIds, $bapCourseIds);
        
        if (empty($allCourseIds)) {
            echo "ERROR: No courses found for Engineering or BAP departments!\n";
            exit;
        }
        
        foreach ($invalidCourseStudents as $index => $student) {
            // Alternate between Engineering and BAP courses
            $courseId = $allCourseIds[$index % count($allCourseIds)];
            
            // Update student's course_id
            DB::table('students')
                ->where('student_id', $student->student_id)
                ->update(['course_id' => $courseId]);
            
            echo "  - {$student->first_name} {$student->last_name} assigned to course ID: {$courseId}\n";
        }
        
        echo "Course assignments fixed!\n";
    }
    
    // Now let's check the final distribution
    echo "\n=== FINAL STUDENT DISTRIBUTION ===\n";
    
    $finalDistribution = DB::table('students')
        ->join('courses', 'students.course_id', '=', 'courses.course_id')
        ->join('departments', 'courses.department_id', '=', 'departments.department_id')
        ->select('departments.department_name', DB::raw('COUNT(*) as student_count'))
        ->groupBy('departments.department_name')
        ->get();
    
    foreach ($finalDistribution as $dept) {
        echo "- {$dept->department_name}: {$dept->student_count} students\n";
    }
    
    // Verify total count
    $finalTotal = DB::table('students')->count();
    echo "\nTotal students after fix: {$finalTotal}\n";
    
    echo "\n=== SYNCING ENROLLMENTS TABLE ===\n";
    
    // Clear enrollments table
    DB::table('enrollments')->truncate();
    echo "Enrollments table cleared\n";
    
    // Recreate enrollments from students table
    $studentsForEnrollment = DB::table('students')
        ->join('courses', 'students.course_id', '=', 'courses.course_id')
        ->select('students.student_id', 'courses.course_id')
        ->get();
    
    $enrollmentData = [];
    foreach ($studentsForEnrollment as $student) {
        $enrollmentData[] = [
            'student_id' => $student->student_id,
            'course_id' => $student->course_id,
            'enrollment_date' => now(),
            'status' => 'active'
        ];
    }
    
    if (!empty($enrollmentData)) {
        DB::table('enrollments')->insert($enrollmentData);
        echo "Created " . count($enrollmentData) . " enrollment records\n";
    }
    
    echo "\n=== VERIFICATION ===\n";
    $finalStudentsCount = DB::table('students')->count();
    $finalEnrollmentsCount = DB::table('enrollments')->count();
    echo "- Students table: {$finalStudentsCount} records\n";
    $finalEnrollmentsCount = DB::table('enrollments')->count();
    echo "- Enrollments table: {$finalEnrollmentsCount} records\n";
    
    if ($finalStudentsCount === $finalEnrollmentsCount) {
        echo "✓ SUCCESS: Student and enrollment counts now match!\n";
    } else {
        echo "✗ ERROR: Counts still don't match!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
