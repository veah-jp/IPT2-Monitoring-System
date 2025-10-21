<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnrollmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('enrollments')) {
            Schema::create('enrollments', function (Blueprint $table) {
                $table->id('enrollment_id');
                $table->unsignedBigInteger('student_id')->nullable();
                $table->unsignedBigInteger('course_id')->nullable();
                $table->string('grade', 2)->nullable();
                $table->date('enrollment_date')->nullable();
                $table->timestamps();

                $table->foreign('student_id')->references('student_id')->on('students')->onDelete('set null');
                $table->foreign('course_id')->references('course_id')->on('courses')->onDelete('set null');
            });
        } else {
            // Table exists, let's modify it to match our schema
            Schema::table('enrollments', function (Blueprint $table) {
                // Check if columns exist and add them if they don't
                if (!Schema::hasColumn('enrollments', 'student_id')) {
                    $table->unsignedBigInteger('student_id')->nullable();
                }
                if (!Schema::hasColumn('enrollments', 'course_id')) {
                    $table->unsignedBigInteger('course_id')->nullable();
                }
                if (!Schema::hasColumn('enrollments', 'grade')) {
                    $table->string('grade', 2)->nullable();
                }
                if (!Schema::hasColumn('enrollments', 'enrollment_date')) {
                    $table->date('enrollment_date')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
}
