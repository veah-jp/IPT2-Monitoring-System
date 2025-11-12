<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Department;
use App\Models\Faculty;

require_once 'vendor/autoload.php';

// Bootstrap Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\\Contracts\\Console\\Kernel')->bootstrap();

try {
    echo "=== BULK ADD: 10 FACULTY PER DEPARTMENT ===\n\n";

    $faker = Faker::create();
    $departments = Department::orderBy('department_name')->get();

    echo "Found departments: " . $departments->count() . "\n\n";

    $totalCreated = 0;

    foreach ($departments as $department) {
        echo "Department: {$department->department_name} [ID {$department->department_id}]\n";

        for ($i = 1; $i <= 10; $i++) {
            $gender = $faker->randomElement(['Male', 'Female']);
            $firstName = $gender === 'Male' ? $faker->firstNameMale : $faker->firstNameFemale;
            $lastName = $faker->lastName;

            // Faculty age 25-65
            $dob = $faker->dateTimeBetween('-65 years', '-25 years')->format('Y-m-d');
            // Hire date within last 10 years
            $hireDate = $faker->dateTimeBetween('-10 years', 'now')->format('Y-m-d');

            $emailLocal = Str::slug($firstName . '.' . $lastName);
            $email = $emailLocal . '.' . Str::slug($department->department_name) . '.' . $i . '@faculty.example.com';
            $phone = '09' . str_pad((string)$faker->numberBetween(100000000, 999999999), 9, '0', STR_PAD_LEFT);

            $faculty = Faculty::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'gender' => $gender,
                'date_of_birth' => $dob,
                'department_id' => $department->department_id,
                'email' => $email,
                'phone' => $phone,
                'hire_date' => $hireDate,
                'is_active' => 1,
            ]);

            echo "  ✔ Created {$firstName} {$lastName} (ID {$faculty->faculty_id})\n";
            $totalCreated++;
        }

        echo "-- Added 10 faculty for department ID {$department->department_id} --\n\n";
    }

    echo "=== DONE ===\n";
    echo "Total faculty created: {$totalCreated}\n\n";

    echo "Verification (faculty per department):\n";
    $rows = DB::table('faculty')
        ->select('department_id', DB::raw('COUNT(*) as cnt'))
        ->groupBy('department_id')
        ->orderBy('department_id')
        ->get();
    foreach ($rows as $row) {
        echo "Department {$row->department_id}: {$row->cnt} faculty total\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>


