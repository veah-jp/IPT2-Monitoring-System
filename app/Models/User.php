<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'email',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Get the name of the password field.
     */
    public function getPasswordName()
    {
        return 'password_hash';
    }

    /**
     * Check if user is admin (all users are considered admin in simplified system)
     */
    public function isAdmin()
    {
        return true;
    }

    /**
     * Get the faculty record associated with this user
     * Note: In the simplified system, users are not linked to faculty profiles.
     */
    public function faculty()
    {
        return null;
    }

    /**
     * Get the student record associated with this user
     * Note: In the simplified system, users are not linked to student profiles.
     */
    public function student()
    {
        return null;
    }
}
