<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id('user_id');
                $table->string('username', 50)->unique();
                $table->string('password_hash', 255);
                $table->enum('role', ['student', 'faculty', 'admin']);
                $table->unsignedBigInteger('linked_id')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        } else {
            // Table exists, let's modify it to match our schema
            Schema::table('users', function (Blueprint $table) {
                // Check if columns exist and add them if they don't
                if (!Schema::hasColumn('users', 'username')) {
                    $table->string('username', 50)->unique();
                }
                if (!Schema::hasColumn('users', 'password_hash')) {
                    $table->string('password_hash', 255);
                }
                if (!Schema::hasColumn('users', 'role')) {
                    $table->enum('role', ['student', 'faculty', 'admin']);
                }
                if (!Schema::hasColumn('users', 'linked_id')) {
                    $table->unsignedBigInteger('linked_id')->nullable();
                }
                if (!Schema::hasColumn('users', 'created_at')) {
                    $table->timestamp('created_at')->useCurrent();
                }
                if (!Schema::hasColumn('users', 'updated_at')) {
                    $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
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
        Schema::dropIfExists('users');
    }
}
