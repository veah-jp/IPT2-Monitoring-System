<?php

// app/Models/Student.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enrollment;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students'; // The name of the table
    protected $primaryKey = 'student_id'; // The name of the primary key

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'address',
        'contact_number',
        'email_address',
        'course_id',
        'year',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the user account associated with this student.
     * Note: In the simplified system, students are not linked to user accounts.
     */
    public function user()
    {
        return null;
    }

    /**
     * Get the course this student is enrolled in.
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }

    /**
     * Get the enrollments for this student.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'student_id');
    }

    /**
     * Get the courses this student is enrolled in through enrollments.
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments', 'student_id', 'course_id');
    }

    /**
     * Boot the model and register model events.
     */
    protected static function boot()
    {
        parent::boot();

        // When a student is created, automatically create an enrollment
        static::created(function ($student) {
            if ($student->course_id) {
                Enrollment::create([
                    'student_id' => $student->student_id,
                    'course_id' => $student->course_id,
                    'enrollment_date' => now()
                ]);
            }
        });
    }
}