<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

try {
    echo "=== INVESTIGATING STUDENT COUNT DISCREPANCY ===\n\n";
    
    // Method 1: Direct count from students table
    $directCount = DB::table('students')->count();
    echo "1. Direct count from students table: {$directCount}\n";
    
    // Method 2: Count with pagination (like the controller does)
    $paginatedStudents = DB::table('students')->paginate(20);
    echo "2. Paginated count (total): {$paginatedStudents->total()}\n";
    
    // Method 3: Count with relationships (like the view does)
    $studentsWithRelations = DB::table('students')
        ->leftJoin('courses', 'students.course_id', '=', 'courses.course_id')
        ->leftJoin('departments', 'courses.department_id', '=', 'departments.department_id')
        ->select('students.student_id', 'students.first_name', 'students.last_name', 
                'students.course_id', 'courses.course_name', 'departments.department_name')
        ->get();
    echo "3. Count with relationships: {$studentsWithRelations->count()}\n";
    
    // Method 4: Check for duplicates
    $duplicateIds = DB::table('students')
        ->select('student_id', DB::raw('COUNT(*) as count'))
        ->groupBy('student_id')
        ->having('count', '>', 1)
        ->get();
    
    echo "4. Duplicate student IDs found: " . $duplicateIds->count() . "\n";
    if ($duplicateIds->count() > 0) {
        foreach ($duplicateIds as $duplicate) {
            echo "   - Student ID {$duplicate->student_id}: {$duplicate->count} times\n";
        }
    }
    
    // Method 5: Check for soft deletes or hidden records
    $allColumns = DB::select("DESCRIBE students");
    echo "\n5. Students table structure:\n";
    foreach ($allColumns as $column) {
        echo "   - {$column->Field} ({$column->Type})\n";
    }
    
    // Method 6: Check if there are any hidden/archived students
    $hiddenStudents = DB::table('students')
        ->where('deleted_at', '!=', null)
        ->orWhere('status', 'hidden')
        ->orWhere('is_active', 0)
        ->count();
    echo "\n6. Hidden/archived students: {$hiddenStudents}\n";
    
    // Method 7: Check enrollments table
    $enrollmentCount = DB::table('enrollments')->count();
    echo "7. Total enrollments: {$enrollmentCount}\n";
    
    // Method 8: Check for students in enrollments but not in students table
    $enrollmentOnlyStudents = DB::table('enrollments')
        ->leftJoin('students', 'enrollments.student_id', '=', 'students.student_id')
        ->where('students.student_id', null)
        ->count();
    echo "8. Students in enrollments but not in students table: {$enrollmentOnlyStudents}\n";
    
    echo "\n=== SUMMARY ===\n";
    echo "The discrepancy might be caused by:\n";
    echo "- Duplicate records\n";
    echo "- Hidden/archived students\n";
    echo "- Students only in enrollments table\n";
    echo "- Pagination counting vs direct counting\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
