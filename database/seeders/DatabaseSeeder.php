<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Course;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create CSP Department
        $cspDepartment = Department::create([
            'department_code' => 'CSP',
            'department_name' => 'College of Science and Programming (CSP)',
        ]);

        // Create CSP Courses
        $courses = [
            [
                'course_code' => 'BSIT',
                'course_name' => 'BSIT - Bachelor of Science in Information Technology',
                'credits' => 144,
                'department_id' => $cspDepartment->department_id,
            ],
            [
                'course_code' => 'BSCS',
                'course_name' => 'BSCS - Bachelor of Science in Computer Science',
                'credits' => 144,
                'department_id' => $cspDepartment->department_id,
            ],
            [
                'course_code' => 'BSLIB',
                'course_name' => 'BSLIB - Bachelor of Science in Library and Information Science',
                'credits' => 144,
                'department_id' => $cspDepartment->department_id,
            ],
            [
                'course_code' => 'MULTIMEDIA',
                'course_name' => 'MULTIMEDIA - Bachelor of Science in Multimedia Arts',
                'credits' => 144,
                'department_id' => $cspDepartment->department_id,
            ],
        ];

        foreach ($courses as $courseData) {
            Course::create($courseData);
        }

        // Create Sample Students for each course
        $students = [
            // BSIT Students
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'gender' => 'Male',
                'date_of_birth' => '2000-05-15',
                'address' => '123 Main St, City',
                'course' => 'BSIT - Bachelor of Science in Information Technology',
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'gender' => 'Female',
                'date_of_birth' => '2001-03-22',
                'address' => '456 Oak Ave, Town',
                'course' => 'BSIT - Bachelor of Science in Information Technology',
            ],
            [
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'gender' => 'Male',
                'date_of_birth' => '2000-11-08',
                'address' => '789 Pine Rd, Village',
                'course' => 'BSIT - Bachelor of Science in Information Technology',
            ],
            
            // BSCS Students
            [
                'first_name' => 'Sarah',
                'last_name' => 'Wilson',
                'gender' => 'Female',
                'date_of_birth' => '2001-07-14',
                'address' => '321 Elm St, Borough',
                'course' => 'BSCS - Bachelor of Science in Computer Science',
            ],
            [
                'first_name' => 'David',
                'last_name' => 'Brown',
                'gender' => 'Male',
                'date_of_birth' => '2000-09-30',
                'address' => '654 Maple Dr, District',
                'course' => 'BSCS - Bachelor of Science in Computer Science',
            ],
            [
                'first_name' => 'Lisa',
                'last_name' => 'Davis',
                'gender' => 'Female',
                'date_of_birth' => '2001-01-18',
                'address' => '987 Cedar Ln, County',
                'course' => 'BSCS - Bachelor of Science in Computer Science',
            ],
            
            // BSLIB Students
            [
                'first_name' => 'Robert',
                'last_name' => 'Miller',
                'gender' => 'Male',
                'date_of_birth' => '2000-12-05',
                'address' => '147 Birch Way, Parish',
                'course' => 'BSLIB - Bachelor of Science in Library and Information Science',
            ],
            [
                'first_name' => 'Emily',
                'last_name' => 'Garcia',
                'gender' => 'Female',
                'date_of_birth' => '2001-04-12',
                'address' => '258 Spruce Ct, Township',
                'course' => 'BSLIB - Bachelor of Science in Library and Information Science',
            ],
            
            // MULTIMEDIA Students
            [
                'first_name' => 'Alex',
                'last_name' => 'Martinez',
                'gender' => 'Male',
                'date_of_birth' => '2000-08-25',
                'address' => '369 Willow Pl, Municipality',
                'course' => 'MULTIMEDIA - Bachelor of Science in Multimedia Arts',
            ],
            [
                'first_name' => 'Sophia',
                'last_name' => 'Rodriguez',
                'gender' => 'Female',
                'date_of_birth' => '2001-06-03',
                'address' => '741 Aspen Blvd, Province',
                'course' => 'MULTIMEDIA - Bachelor of Science in Multimedia Arts',
            ],
        ];

        foreach ($students as $studentData) {
            $course = Course::where('course_name', $studentData['course'])->first();
            unset($studentData['course']);
            
            $studentData['course_id'] = $course->course_id;
            $studentData['year'] = '2nd Year'; // Default year
            
            $student = Student::create($studentData);
            
            // Create user account for student
            User::create([
                'username' => strtolower($student->first_name . $student->last_name),
                'password_hash' => Hash::make('password123'),
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'email' => strtolower($student->first_name . '.' . $student->last_name . '@student.edu'),
            ]);
        }

        // Create Sample Faculty for CSP
        $faculty = [
            [
                'first_name' => 'Dr. Maria',
                'last_name' => 'Santos',
                'department_id' => $cspDepartment->department_id,
                'gender' => 'Female',
                'email' => 'maria.santos@university.edu',
            ],
            [
                'first_name' => 'Prof. Carlos',
                'last_name' => 'Reyes',
                'department_id' => $cspDepartment->department_id,
                'gender' => 'Male',
                'email' => 'carlos.reyes@university.edu',
            ],
            [
                'first_name' => 'Ms. Ana',
                'last_name' => 'Cruz',
                'department_id' => $cspDepartment->department_id,
                'gender' => 'Female',
                'email' => 'ana.cruz@university.edu',
            ],
            [
                'first_name' => 'Mr. Jose',
                'last_name' => 'Gonzalez',
                'department_id' => $cspDepartment->department_id,
                'gender' => 'Male',
                'email' => 'jose.gonzalez@university.edu',
            ],
        ];

        foreach ($faculty as $facultyData) {
            $facultyMember = Faculty::create($facultyData);
            
            // Create user account for faculty
            User::create([
                'username' => strtolower($facultyMember->first_name . $facultyMember->last_name),
                'password_hash' => Hash::make('password123'),
                'first_name' => $facultyMember->first_name,
                'last_name' => $facultyMember->last_name,
                'email' => $facultyMember->email,
            ]);
        }

        // Create Admin User
        User::create([
            'username' => 'admin2024',
            'password_hash' => Hash::make('password123'),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@university.edu',
        ]);

        echo "Database seeded successfully!\n";
        echo "CSP Department created with 4 courses:\n";
        echo "- BSIT (Bachelor of Science in Information Technology)\n";
        echo "- BSCS (Bachelor of Science in Computer Science)\n";
        echo "- BSLIB (Bachelor of Science in Library and Information Science)\n";
        echo "- MULTIMEDIA (Bachelor of Science in Multimedia Arts)\n";
        echo "\nCreated:\n";
        echo "- 10 Students across all courses (enrollments created automatically)\n";
        echo "- 4 Faculty members\n";
        echo "- 1 Admin user (admin2024/password123)\n";
    }
}
