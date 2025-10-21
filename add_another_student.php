<?php
require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Student;

try {
    echo "=== ADDING ANOTHER STUDENT ===\n\n";
    
    // Check current state
    echo "Current state:\n";
    $studentsCount = DB::table('students')->count();
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "- Students: {$studentsCount}\n";
    echo "- Enrollments: {$enrollmentsCount}\n\n";
    
    // Create another student
    echo "Creating another student...\n";
    
    $studentData = [
        'first_name' => 'Michael',
        'last_name' => 'Johnson',
        'gender' => 'Male',
        'date_of_birth' => '1999-11-08',
        'address' => '789 Pine Avenue, City, Province 9012',
        'course_id' => 3, // BSLIB course
        'year' => '4th Year'
    ];
    
    echo "Student data:\n";
    foreach ($studentData as $key => $value) {
        echo "- {$key}: {$value}\n";
    }
    echo "\n";
    
    // Create the student (this should automatically create enrollment)
    $student = Student::create($studentData);
    
    echo "✓ SUCCESS: Student created with ID: {$student->student_id}\n\n";
    
    // Check if enrollment was created automatically
    echo "Checking if enrollment was created automatically...\n";
    $enrollment = DB::table('enrollments')
        ->where('student_id', $student->student_id)
        ->first();
    
    if ($enrollment) {
        echo "✓ SUCCESS: Enrollment created automatically!\n";
        echo "- Enrollment ID: {$enrollment->enrollment_id}\n";
        echo "- Student ID: {$enrollment->student_id}\n";
        echo "- Course ID: {$enrollment->course_id}\n";
        echo "- Enrollment Date: {$enrollment->enrollment_date}\n\n";
        
        // Get course details
        $course = DB::table('courses')
            ->where('course_id', $student->course_id)
            ->first();
        
        if ($course) {
            echo "Course: {$course->course_name}\n";
        }
        
        echo "✓ The automatic enrollment system is working perfectly!\n";
    } else {
        echo "✗ FAILED: No enrollment created automatically!\n";
    }
    
    // Final verification
    echo "\n=== FINAL VERIFICATION ===\n";
    $finalStudentsCount = DB::table('students')->count();
    $finalEnrollmentsCount = DB::table('enrollments')->count();
    
    echo "- Students table: {$finalStudentsCount} records\n";
    echo "- Enrollments table: {$finalEnrollmentsCount} records\n";
    
    if ($finalStudentsCount > 0 && $finalEnrollmentsCount > 0) {
        echo "✓ SUCCESS: Both tables now have records!\n";
    }
    
    echo "\n=== COMPLETE ===\n";
    echo "Michael Johnson has been added as a student and automatically enrolled!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
