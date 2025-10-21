<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MonitoringController;
use Illuminate\Support\Facades\View;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Redirect root to login
Route::get('/', function () {
    return redirect()->route('login');
});

// Authentication routes
// Use React login as default
Route::get('/login', function () {
    return view('auth.login-react');
})->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Experimental React login route
Route::get('/login-react', function () {
    return view('auth.login-react');
})->name('login.react');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    // Profile routes
    Route::get('/profile', [AuthController::class, 'showProfile'])->name('profile');
    Route::get('/change-password', [AuthController::class, 'showChangePasswordForm'])->name('change-password');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->name('change-password.post');
    
    // Account route
    Route::get('/account', function () {
        return redirect('/account-react');
    })->name('account');
    Route::get('/account-react', function () {
        return view('monitoring.account-react');
    })->name('account.react');
    
    // Reports route
    Route::get('/reports', [MonitoringController::class, 'reports'])->name('reports');
    
    // Reports API routes
    Route::post('/api/reports/data', [MonitoringController::class, 'getReportsData'])->name('api.reports.data');
    
    // Account API routes
    Route::post('/api/profile/update', [MonitoringController::class, 'updateProfile'])->name('api.profile.update');
    Route::post('/api/profile/change-password', [MonitoringController::class, 'changePassword'])->name('api.profile.change-password');
    
    // Monitoring routes
    Route::get('/dashboard', function () {
        return redirect('/dashboard-react');
    })->name('dashboard');
    Route::get('/dashboard-react', function () {
        return view('monitoring.dashboard-react');
    })->name('dashboard.react');
    Route::get('/students', [MonitoringController::class, 'students'])->name('students');
    Route::get('/students-react', function () {
        $students = \App\Models\Student::where(function($query) {
            $query->where('is_active', 1)->orWhereNull('is_active');
        })->with(['course.department'])->paginate(20);
        return view('monitoring.students-react', compact('students'));
    })->name('students.react');
    
    Route::get('/faculty-react', function () {
        $faculty = \App\Models\Faculty::with('department')
        ->where(function($query) {
            $query->where('is_active', 1)->orWhereNull('is_active');
        })->paginate(20);
        
        $departments = \App\Models\Department::where(function($query) {
            $query->where('is_active', 1)->orWhereNull('is_active');
        })->get();
        
        return view('monitoring.faculty-react', compact('faculty', 'departments'));
    })->name('faculty.react');
    Route::post('/students', [MonitoringController::class, 'addStudent'])->name('students.add');
    Route::get('/students/{student}', [MonitoringController::class, 'getStudent'])->name('students.show');
    Route::get('/students/{student}/edit', [MonitoringController::class, 'getStudent'])->name('students.edit');

    Route::put('/students/{student}', [MonitoringController::class, 'updateStudent'])->name('students.update');
    Route::post('/students/{studentId}/archive', [MonitoringController::class, 'archiveStudent'])->name('students.archive');
    Route::get('/courses', [MonitoringController::class, 'courses'])->name('courses');
    Route::get('/departments', [MonitoringController::class, 'departments'])->name('departments');
    Route::get('/enrollments', [MonitoringController::class, 'enrollments'])->name('enrollments');
    Route::get('/faculty', function () {
        return redirect('/faculty-react');
    })->name('faculty');
    Route::post('/faculty', [MonitoringController::class, 'addFaculty'])->name('faculty.add');
    Route::put('/faculty/{facultyId}', [MonitoringController::class, 'updateFaculty'])->name('faculty.update');
    Route::post('/faculty/{facultyId}/archive', [MonitoringController::class, 'archiveFaculty'])->name('faculty.archive');
    
    // Settings routes
    Route::get('/settings', function () {
        return redirect('/settings-react');
    })->name('settings');
    Route::get('/settings-react', function () {
        $departments = \App\Models\Department::where(function($query) {
            $query->where('is_active', 1)->orWhereNull('is_active');
        })->get();
        return view('monitoring.settings-react', compact('departments'));
    })->name('settings.react');
    Route::get('/settings-test', function() {
        return 'Settings route is working!';
    })->name('settings.test');

    // Settings API routes
    Route::get('/api/archived-students', [MonitoringController::class, 'getArchivedStudents'])->name('api.archived-students');
    Route::post('/api/restore-student/{id}', [MonitoringController::class, 'restoreStudent'])->name('api.restore-student');
    Route::delete('/api/delete-student/{id}', [MonitoringController::class, 'deleteStudent'])->name('api.delete-student');
    Route::get('/api/archived-faculty', [MonitoringController::class, 'getArchivedFaculty'])->name('api.archived-faculty');
    Route::post('/api/restore-faculty/{id}', [MonitoringController::class, 'restoreFaculty'])->name('api.restore-faculty');
    
    // Course Management API routes
    Route::get('/api/courses', [MonitoringController::class, 'getCourses'])->name('api.courses');
    Route::get('/api/courses/{id}', [MonitoringController::class, 'getCourse'])->name('api.courses.show');
    Route::post('/api/courses', [MonitoringController::class, 'addCourse'])->name('api.courses.add');
    Route::put('/api/courses/{id}', [MonitoringController::class, 'updateCourse'])->name('api.courses.update');
    Route::post('/api/courses/{id}/archive', [MonitoringController::class, 'archiveCourse'])->name('api.courses.archive');
    Route::post('/api/restore-course/{id}', [MonitoringController::class, 'restoreCourse'])->name('api.restore-course');
                    Route::get('/api/archived-courses', [MonitoringController::class, 'getArchivedCourses'])->name('api.archived-courses');

                // Department Management API routes
                Route::get('/api/departments', [MonitoringController::class, 'getDepartments'])->name('api.departments');
                Route::get('/api/departments/{id}', [MonitoringController::class, 'getDepartment'])->name('api.departments.show');
                Route::post('/api/departments', [MonitoringController::class, 'addDepartment'])->name('api.departments.add');
                Route::put('/api/departments/{id}', [MonitoringController::class, 'updateDepartment'])->name('api.departments.update');
                Route::post('/api/departments/{id}/archive', [MonitoringController::class, 'archiveDepartment'])->name('api.departments.archive');
                Route::post('/api/restore-department/{id}', [MonitoringController::class, 'restoreDepartment'])->name('api.restore-department');
                Route::get('/api/archived-departments', [MonitoringController::class, 'getArchivedDepartments'])->name('api.archived-departments');
    
    // API endpoints for dashboard data
    Route::get('/api/departments-data', [MonitoringController::class, 'getDepartmentsData'])->name('api.departments-data');
    Route::get('/api/courses-by-department', [MonitoringController::class, 'getCoursesByDepartment'])->name('api.courses-by-department');
    
    // Search functionality
    Route::get('/search', [MonitoringController::class, 'search'])->name('search');
});
