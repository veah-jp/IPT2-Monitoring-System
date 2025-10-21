<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EnhanceFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('faculty', function (Blueprint $table) {
            // Add new columns if they don't exist
            if (!Schema::hasColumn('faculty', 'email')) {
                $table->string('email', 100)->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('faculty', 'phone')) {
                $table->string('phone', 20)->nullable()->after('email');
            }
            if (!Schema::hasColumn('faculty', 'specialization')) {
                $table->string('specialization', 100)->nullable()->after('phone');
            }
            if (!Schema::hasColumn('faculty', 'hire_date')) {
                $table->date('hire_date')->nullable()->after('specialization');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('faculty', function (Blueprint $table) {
            $table->dropColumn(['email', 'phone', 'specialization', 'hire_date']);
        });
    }
}
