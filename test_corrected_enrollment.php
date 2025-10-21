<?php
require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Student;

try {
    echo "=== TESTING CORRECTED ENROLLMENT CREATION ===\n\n";
    
    // Check current state
    echo "Current state:\n";
    $studentsCount = DB::table('students')->count();
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "- Students: {$studentsCount}\n";
    echo "- Enrollments: {$enrollmentsCount}\n\n";
    
    // Create a test student (without email field)
    echo "Creating a test student...\n";
    
    $studentData = [
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'gender' => 'Female',
        'date_of_birth' => '2001-03-20',
        'address' => '456 Oak Street, City, Province 5678',
        'course_id' => 2, // BSCS course
        'year' => '3rd Year'
    ];
    
    echo "Student data:\n";
    foreach ($studentData as $key => $value) {
        echo "- {$key}: {$value}\n";
    }
    echo "\n";
    
    // Create the student (this should trigger the automatic enrollment creation)
    echo "Creating student...\n";
    $student = Student::create($studentData);
    
    echo "✓ SUCCESS: Student created with ID: {$student->student_id}\n";
    echo "✓ Student enrollment_id: " . ($student->enrollment_id ?? 'NULL') . "\n\n";
    
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
        echo "- Enrollment Date: {$enrollment->enrollment_date}\n";
        echo "- Status: {$enrollment->status}\n\n";
        
        // Verify the relationship
        if ($student->enrollment_id == $enrollment->enrollment_id) {
            echo "✓ SUCCESS: Student and enrollment are properly linked!\n";
        } else {
            echo "✗ ERROR: Student and enrollment are not properly linked!\n";
            echo "Student enrollment_id: {$student->enrollment_id}\n";
            echo "Enrollment enrollment_id: {$enrollment->enrollment_id}\n";
        }
    } else {
        echo "✗ FAILED: No enrollment created automatically!\n";
        echo "This means the model events are not working properly.\n\n";
        
        // Try to create enrollment manually to test the relationship
        echo "Creating enrollment manually to test the relationship...\n";
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
    
    // Final verification
    echo "\n=== FINAL VERIFICATION ===\n";
    $finalStudentsCount = DB::table('students')->count();
    $finalEnrollmentsCount = DB::table('enrollments')->count();
    
    echo "- Students table: {$finalStudentsCount} records\n";
    echo "- Enrollments table: {$finalEnrollmentsCount} records\n";
    
    if ($finalStudentsCount > 0 && $finalEnrollmentsCount > 0) {
        echo "✓ SUCCESS: Both tables now have records!\n";
    }
    
    echo "\n=== TEST COMPLETE ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
