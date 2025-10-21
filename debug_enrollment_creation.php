<?php
require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Student;

try {
    echo "=== DEBUGGING ENROLLMENT CREATION ===\n\n";
    
    // Check database structure
    echo "1. Checking database structure...\n";
    
    // Check students table columns
    $studentColumns = DB::select("SHOW COLUMNS FROM students");
    echo "Students table columns:\n";
    foreach ($studentColumns as $column) {
        echo "- {$column->Field} ({$column->Type})\n";
    }
    echo "\n";
    
    // Check enrollments table columns
    $enrollmentColumns = DB::select("SHOW COLUMNS FROM enrollments");
    echo "Enrollments table columns:\n";
    foreach ($enrollmentColumns as $column) {
        echo "- {$column->Field} ({$column->Type})\n";
    }
    echo "\n";
    
    // Check current data
    echo "2. Checking current data...\n";
    $studentsCount = DB::table('students')->count();
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "- Students: {$studentsCount}\n";
    echo "- Enrollments: {$enrollmentsCount}\n\n";
    
    // Check if courses exist
    echo "3. Checking available courses...\n";
    $courses = DB::table('courses')->get();
    foreach ($courses as $course) {
        echo "- Course ID: {$course->course_id}, Name: {$course->course_name}\n";
    }
    echo "\n";
    
    // Try to create a student manually
    echo "4. Testing manual student creation...\n";
    
    $studentData = [
        'first_name' => 'Test',
        'last_name' => 'Student',
        'email' => 'test@example.com',
        'gender' => 'Male',
        'date_of_birth' => '2000-01-01',
        'address' => 'Test Address',
        'course_id' => 1,
        'year' => '1st Year'
    ];
    
    echo "Creating student with data:\n";
    foreach ($studentData as $key => $value) {
        echo "- {$key}: {$value}\n";
    }
    echo "\n";
    
    // Create student
    $student = Student::create($studentData);
    echo "✓ Student created with ID: {$student->student_id}\n";
    
    // Check if enrollment was created
    $enrollment = DB::table('enrollments')
        ->where('student_id', $student->student_id)
        ->first();
    
    if ($enrollment) {
        echo "✓ SUCCESS: Enrollment created automatically!\n";
        echo "- Enrollment ID: {$enrollment->enrollment_id}\n";
        echo "- Student ID: {$enrollment->student_id}\n";
        echo "- Course ID: {$enrollment->course_id}\n";
    } else {
        echo "✗ FAILED: No enrollment created automatically!\n";
        
        // Try to create enrollment manually
        echo "Trying to create enrollment manually...\n";
        $enrollmentId = DB::table('enrollments')->insertGetId([
            'student_id' => $student->student_id,
            'course_id' => $student->course_id,
            'enrollment_date' => now(),
            'status' => 'active'
        ]);
        
        if ($enrollmentId) {
            echo "✓ Manual enrollment created with ID: {$enrollmentId}\n";
            
            // Update student with enrollment_id
            DB::table('students')
                ->where('student_id', $student->student_id)
                ->update(['enrollment_id' => $enrollmentId]);
            
            echo "✓ Student updated with enrollment_id: {$enrollmentId}\n";
        }
    }
    
    // Final check
    echo "\n5. Final verification...\n";
    $finalStudent = DB::table('students')->where('student_id', $student->student_id)->first();
    $finalEnrollment = DB::table('enrollments')->where('student_id', $student->student_id)->first();
    
    echo "Student enrollment_id: " . ($finalStudent->enrollment_id ?? 'NULL') . "\n";
    echo "Enrollment exists: " . ($finalEnrollment ? 'YES' : 'NO') . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
