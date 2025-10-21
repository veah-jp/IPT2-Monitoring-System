<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';
    protected $primaryKey = 'department_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'department_code',
        'department_name',
        'description',
        'is_active',
    ];

    /**
     * Get the courses for this department.
     */
    public function courses()
    {
        return $this->hasMany(Course::class, 'department_id', 'department_id');
    }

    /**
     * Get the faculty members for this department.
     */
    public function faculty()
    {
        return $this->hasMany(Faculty::class, 'department_id', 'department_id');
    }
}
