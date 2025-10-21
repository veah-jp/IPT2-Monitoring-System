<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeGradeToYearInEnrollmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            // Drop the grade column
            $table->dropColumn('grade');
            
            // Add the year column
            $table->string('year', 10)->nullable()->after('course_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('enrollments', function (Blueprint $table) {
            // Drop the year column
            $table->dropColumn('year');
            
            // Add back the grade column
            $table->string('grade', 2)->nullable()->after('course_id');
        });
    }
}
