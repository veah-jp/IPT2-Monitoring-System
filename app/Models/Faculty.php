<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';
    protected $primaryKey = 'faculty_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'department_id',
        'email',
        'phone',
        'hire_date',
        'is_active'
    ];

    /**
     * Get the department that the faculty member belongs to.
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    /**
     * Get the user account associated with this faculty member.
     * Note: In the simplified system, faculty are not linked to user accounts.
     */
    public function user()
    {
        return null;
    }

    /**
     * Get the full name of the faculty member.
     */
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the courses taught by this faculty member.
     */
    public function courses()
    {
        return $this->hasMany(Course::class, 'faculty_id', 'faculty_id');
    }
}
