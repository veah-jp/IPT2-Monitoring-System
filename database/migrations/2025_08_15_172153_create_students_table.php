<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// The class name might have a timestamp prefix in your actual file name
class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            // Use id() but specify your custom primary key name
            $table->id('student_id');

            // Add the other columns from your design
            $table->string('first_name');
            $table->string('last_name');
            $table->string('gender', 10)->nullable(); // A string with a 10-character limit, can be empty
            $table->date('date_of_birth')->nullable(); // A specific column type for dates, can be empty
            $table->string('address')->nullable(); // Can be empty

            // These add `created_at` and `updated_at` columns automatically
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
}