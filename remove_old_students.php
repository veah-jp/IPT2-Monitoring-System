<?php
require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "=== REMOVING OLD STUDENTS ===\n\n";
    
    // Check current state
    echo "Current state:\n";
    $studentsCount = DB::table('students')->count();
    $enrollmentsCount = DB::table('enrollments')->count();
    echo "- Students: {$studentsCount}\n";
    echo "- Enrollments: {$enrollmentsCount}\n\n";
    
    // Find Michael Johnson (the student we want to keep)
    $michaelJohnson = DB::table('students')
        ->where('first_name', 'Michael')
        ->where('last_name', 'Johnson')
        ->first();
    
    if ($michaelJohnson) {
        echo "✓ Found Michael Johnson (ID: {$michaelJohnson->student_id})\n";
        echo "This student will be kept.\n\n";
        
        // Get all student IDs except Michael Johnson
        $studentsToRemove = DB::table('students')
            ->where('student_id', '!=', $michaelJohnson->student_id)
            ->pluck('student_id')
            ->toArray();
        
        echo "Students to remove: " . count($studentsToRemove) . "\n";
        
        if (count($studentsToRemove) > 0) {
            // Remove enrollments for these students first
            echo "Removing enrollments for old students...\n";
            $removedEnrollments = DB::table('enrollments')
                ->whereIn('student_id', $studentsToRemove)
                ->delete();
            echo "✓ Removed {$removedEnrollments} enrollments\n";
            
            // Remove the old students
            echo "Removing old students...\n";
            $removedStudents = DB::table('students')
                ->whereIn('student_id', $studentsToRemove)
                ->delete();
            echo "✓ Removed {$removedStudents} students\n";
        }
        
        // Final verification
        echo "\n=== FINAL VERIFICATION ===\n";
        $finalStudentsCount = DB::table('students')->count();
        $finalEnrollmentsCount = DB::table('enrollments')->count();
        
        echo "- Students table: {$finalStudentsCount} records\n";
        echo "- Enrollments table: {$finalEnrollmentsCount} records\n";
        
        // Verify Michael Johnson still exists
        $finalMichael = DB::table('students')
            ->where('first_name', 'Michael')
            ->where('last_name', 'Johnson')
            ->first();
        
        if ($finalMichael) {
            echo "✓ Michael Johnson is still in the students table\n";
            
            // Check his enrollment
            $michaelEnrollment = DB::table('enrollments')
                ->where('student_id', $finalMichael->student_id)
                ->first();
            
            if ($michaelEnrollment) {
                echo "✓ Michael Johnson's enrollment is still in the enrollments table\n";
                echo "✓ The automatic enrollment system is working correctly!\n";
            } else {
                echo "✗ ERROR: Michael Johnson's enrollment was removed!\n";
            }
        } else {
            echo "✗ ERROR: Michael Johnson was removed!\n";
        }
        
        echo "\n=== CLEANUP COMPLETE ===\n";
        echo "All old students have been removed. Only Michael Johnson remains.\n";
        
    } else {
        echo "✗ ERROR: Could not find Michael Johnson in the students table!\n";
        echo "Cannot proceed with cleanup.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
