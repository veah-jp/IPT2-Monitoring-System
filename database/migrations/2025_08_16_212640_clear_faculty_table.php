<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ClearFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // WARNING: This will permanently delete ALL faculty records
        // Use with extreme caution as this action cannot be undone
        DB::table('faculty')->truncate();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Note: Cannot restore truncated data
        // This migration permanently removes all faculty records
    }
}
