`` <?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MoveYearFromEnrollmentsToStudents extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add year column to students table
        Schema::table('students', function (Blueprint $table) {
            $table->string('year', 10)->nullable()->after('course_id');
        });
        
        // Remove year column from enrollments table
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn('year');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Add year column back to enrollments table
        Schema::table('enrollments', function (Blueprint $table) {
            $table->string('year', 10)->nullable()->after('course_id');
        });
        
        // Remove year column from students table
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('year');
        });
    }
}
