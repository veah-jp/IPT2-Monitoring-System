<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MonitoringController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Monitoring system routes
Route::get('/departments-data', [MonitoringController::class, 'getDepartmentsData']);

// Department routes
Route::get('/departments', [MonitoringController::class, 'getDepartments']);
Route::get('/departments/{id}', [MonitoringController::class, 'getDepartment']);
Route::post('/departments', [MonitoringController::class, 'addDepartment']);
Route::put('/departments/{id}', [MonitoringController::class, 'updateDepartment']);
Route::post('/departments/{id}/archive', [MonitoringController::class, 'archiveDepartment']);
Route::post('/departments/{id}/restore', [MonitoringController::class, 'restoreDepartment']);
Route::get('/archived-departments', [MonitoringController::class, 'getArchivedDepartments']);

// Course routes
Route::get('/courses', [MonitoringController::class, 'getCourses']);
Route::get('/courses/{id}', [MonitoringController::class, 'getCourse']);
Route::post('/courses', [MonitoringController::class, 'addCourse']);
Route::put('/courses/{id}', [MonitoringController::class, 'updateCourse']);
Route::post('/courses/{id}/archive', [MonitoringController::class, 'archiveCourse']);
Route::post('/courses/{id}/restore', [MonitoringController::class, 'restoreCourse']);
Route::get('/archived-courses', [MonitoringController::class, 'getArchivedCourses']);

// Faculty routes
Route::get('/faculty', [MonitoringController::class, 'getFaculty']);
Route::get('/faculty/{id}', [MonitoringController::class, 'getFacultyMember']);
Route::post('/faculty', [MonitoringController::class, 'addFaculty']);
Route::put('/faculty/{id}', [MonitoringController::class, 'updateFaculty']);
Route::post('/faculty/{id}/archive', [MonitoringController::class, 'archiveFaculty']);
Route::post('/faculty/{id}/restore', [MonitoringController::class, 'restoreFaculty']);
Route::get('/archived-faculty', [MonitoringController::class, 'getArchivedFaculty']);

// Student routes
Route::get('/students', [MonitoringController::class, 'getStudents']);
Route::get('/students/{id}', [MonitoringController::class, 'getStudent']);
Route::post('/students', [MonitoringController::class, 'addStudent']);
Route::put('/students/{id}', [MonitoringController::class, 'updateStudent']);
Route::post('/students/{id}/archive', [MonitoringController::class, 'archiveStudent']);
Route::post('/students/{id}/restore', [MonitoringController::class, 'restoreStudent']);
Route::get('/archived-students', [MonitoringController::class, 'getArchivedStudents']);

// Statistics routes
Route::get('/stats/departments', [MonitoringController::class, 'getDepartmentStats']);
Route::get('/stats/courses', [MonitoringController::class, 'getCourseStats']);
Route::get('/stats/faculty', [MonitoringController::class, 'getFacultyStats']);
Route::get('/stats/students', [MonitoringController::class, 'getStudentStats']);
Route::get('/stats/student-archives', [MonitoringController::class, 'getStudentArchiveStats']);
Route::get('/stats/faculty-archives', [MonitoringController::class, 'getFacultyArchiveStats']);


