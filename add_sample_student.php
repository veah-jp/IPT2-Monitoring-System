<?php
require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Student;

try {
    echo "=== ADDING SAMPLE STUDENT WITH COMPLETE DETAILS ===\n\n";
    
    // Check current state
    echo "Current state:\n";
    $studentsCount = DB::table('students')->count();
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "- Students table: {$studentsCount} records\n";
    echo "- Enrollments table: {$enrollmentsCount} records\n\n";
    
    // Sample student data
    $studentData = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@example.com',
        'gender' => 'Male',
        'date_of_birth' => '2000-05-15',
        'address' => '123 Main Street, City, Province 1234',
        'course_id' => 1, // BSIT course
        'year' => '2nd Year'
    ];
    
    echo "Creating sample student with the following details:\n";
    foreach ($studentData as $key => $value) {
        echo "- {$key}: {$value}\n";
    }
    echo "\n";
    
    // Create the student (this will automatically create enrollment via model events)
    echo "Step 1: Creating student...\n";
    $student = Student::create($studentData);
    
    echo "✓ SUCCESS: Student created with ID: {$student->student_id}\n";
    echo "✓ Student enrollment_id: {$student->enrollment_id}\n\n";
    
    // Verify the enrollment was created automatically
    echo "Step 2: Verifying automatic enrollment creation...\n";
    $enrollment = DB::table('enrollments')
        ->where('student_id', $student->student_id)
        ->first();
    
    if ($enrollment) {
        echo "✓ SUCCESS: Enrollment automatically created!\n";
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
        }
    } else {
        echo "✗ ERROR: No enrollment was created automatically!\n";
    }
    
    // Get course details
    echo "Step 3: Getting course details...\n";
    $course = DB::table('courses')
        ->where('course_id', $student->course_id)
        ->first();
    
    if ($course) {
        echo "✓ Course found:\n";
        echo "- Course ID: {$course->course_id}\n";
        echo "- Course Name: {$course->course_name}\n";
        echo "- Units: {$course->units}\n";
        echo "- Semester: {$course->semester}\n\n";
        
        // Get department details
        $department = DB::table('departments')
            ->where('department_id', $course->department_id)
            ->first();
        
        if ($department) {
            echo "✓ Department found:\n";
            echo "- Department ID: {$department->department_id}\n";
            echo "- Department Name: {$department->department_name}\n\n";
        }
    }
    
    // Check final state
    echo "=== FINAL VERIFICATION ===\n";
    $finalStudentsCount = DB::table('students')->count();
    $finalEnrollmentsCount = DB::table('enrollments')->count();
    
    echo "- Students table: {$finalStudentsCount} records\n";
    echo "- Enrollments table: {$finalEnrollmentsCount} records\n";
    
    if ($finalStudentsCount > 0 && $finalEnrollmentsCount > 0) {
        echo "✓ SUCCESS: Both tables now have records!\n";
    }
    
    // Display complete student record
    echo "\n=== COMPLETE STUDENT RECORD ===\n";
    $completeStudent = DB::table('students')
        ->join('courses', 'students.course_id', '=', 'courses.course_id')
        ->join('departments', 'courses.department_id', '=', 'departments.department_id')
        ->leftJoin('enrollments', 'students.enrollment_id', '=', 'enrollments.enrollment_id')
        ->select(
            'students.*',
            'courses.course_name',
            'departments.department_name',
            'enrollments.enrollment_date',
            'enrollments.status'
        )
        ->where('students.student_id', $student->student_id)
        ->first();
    
    if ($completeStudent) {
        echo "Student Information:\n";
        echo "- Full Name: {$completeStudent->first_name} {$completeStudent->last_name}\n";
        echo "- Email: {$completeStudent->email}\n";
        echo "- Gender: {$completeStudent->gender}\n";
        echo "- Date of Birth: {$completeStudent->date_of_birth}\n";
        echo "- Address: {$completeStudent->address}\n";
        echo "- Year Level: {$completeStudent->year}\n";
        echo "- Course: {$completeStudent->course_name}\n";
        echo "- Department: {$completeStudent->department_name}\n";
        echo "- Enrollment Date: {$completeStudent->enrollment_date}\n";
        echo "- Enrollment Status: {$completeStudent->status}\n";
    }
    
    echo "\n=== SAMPLE STUDENT ADDED SUCCESSFULLY ===\n";
    echo "John Doe has been added as a student and automatically enrolled!\n";
    echo "The system now demonstrates the automatic enrollment creation.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
