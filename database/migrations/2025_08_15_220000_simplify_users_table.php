<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SimplifyUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop role and linked_id columns
            $table->dropColumn(['role', 'linked_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Add back the columns if rolling back
            $table->enum('role', ['student', 'faculty', 'admin'])->after('password_hash');
            $table->unsignedBigInteger('linked_id')->nullable()->after('role');
        });
    }
}
