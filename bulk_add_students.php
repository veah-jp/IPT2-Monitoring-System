<?php
require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\Course;
use App\Models\Student;
use Faker\Factory as Faker;

try {
    echo "=== BULK ADD: 10 STUDENTS PER COURSE ===\n\n";

    $courses = Course::with('department')->orderBy('course_name')->get();
    $faker = Faker::create();

    // CLI flag: --only-empty => add 10 students only to courses with 0 students currently
    $onlyEmpty = in_array('--only-empty', $argv ?? []);

    echo "Found courses: " . $courses->count() . "\n\n";

    $totalCreated = 0;

    foreach ($courses as $course) {
        if ($onlyEmpty) {
            $existingCount = Student::where('course_id', $course->course_id)->count();
            if ($existingCount > 0) {
                // Skip non-empty courses
                continue;
            }
        }
        $deptName = $course->department ? $course->department->department_name : 'Unassigned';
        echo "Course: {$course->course_name} (Dept: {$deptName}) [ID {$course->course_id}]\n";

        for ($i = 1; $i <= 10; $i++) {
            $gender = $faker->randomElement(['Male', 'Female']);
            $firstName = $gender === 'Male' ? $faker->firstNameMale : $faker->firstNameFemale;
            $lastName = $faker->lastName;

            // Age between 17 and 24
            $dob = $faker->dateTimeBetween('-24 years', '-17 years')->format('Y-m-d');

            $address = $faker->streetAddress . ', ' . $faker->city . ', ' . $faker->state . ' ' . $faker->postcode;
            $yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
            $year = $faker->randomElement($yearLevels);

            // Reasonably-shaped local mobile number
            $contact = '09' . str_pad((string)$faker->numberBetween(100000000, 999999999), 9, '0', STR_PAD_LEFT);

            // Unique email based on name + course + counter
            $email = strtolower(
                Str::slug($firstName . '.' . $lastName) . '.' . Str::slug($course->course_name) . '.' . $i . '@example.com'
            );

            $studentData = [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'gender' => $gender,
                'date_of_birth' => $dob,
                'address' => $address,
                'contact_number' => $contact,
                'email_address' => $email,
                'course_id' => $course->course_id,
                'year' => $year,
                'is_active' => 1,
            ];

            $student = Student::create($studentData);

            echo "  ✔ Created {$firstName} {$lastName} (ID {$student->student_id}) for course {$course->course_name}\n";
            $totalCreated++;
        }

        echo "-- Added 10 students for course ID {$course->course_id} --\n\n";
    }

    echo "=== DONE ===\n";
    echo "Total students created: {$totalCreated}\n";

    // Quick verification per course (counts of enrollments by course)
    echo "\nVerification (enrollments per course added in this run not isolated):\n";
    $rows = DB::table('enrollments')
        ->select('course_id', DB::raw('COUNT(*) as cnt'))
        ->groupBy('course_id')
        ->orderBy('course_id')
        ->get();
    foreach ($rows as $row) {
        echo "Course {$row->course_id}: {$row->cnt} enrollments total\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>


