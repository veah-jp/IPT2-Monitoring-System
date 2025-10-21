<?php
require_once 'vendor/autoload.php';

try {
    echo "Simple database check...\n";
    
    // Check students count
    $studentsCount = DB::table('students')->count();
    echo "Students: {$studentsCount}\n";
    
    // Check enrollments count
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "Enrollments: {$enrollmentsCount}\n";
    
    // Check courses count
    $coursesCount = DB::table('courses')->count();
    echo "Courses: {$coursesCount}\n";
    
    // Check departments count
    $departmentsCount = DB::table('departments')->count();
    echo "Departments: {$departmentsCount}\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
