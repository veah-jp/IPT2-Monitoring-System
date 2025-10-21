<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('faculty')) {
            Schema::create('faculty', function (Blueprint $table) {
                $table->id('faculty_id');
                $table->string('first_name', 50);
                $table->string('last_name', 50);
                $table->unsignedBigInteger('department_id')->nullable();
                $table->timestamps();

                $table->foreign('department_id')->references('department_id')->on('departments')->onDelete('set null');
            });
        } else {
            // Table exists, let's modify it to match our schema
            Schema::table('faculty', function (Blueprint $table) {
                // Check if columns exist and add them if they don't
                if (!Schema::hasColumn('faculty', 'first_name')) {
                    $table->string('first_name', 50);
                }
                if (!Schema::hasColumn('faculty', 'last_name')) {
                    $table->string('last_name', 50);
                }
                if (!Schema::hasColumn('faculty', 'department_id')) {
                    $table->unsignedBigInteger('department_id')->nullable();
                }
                if (!Schema::hasColumn('faculty', 'created_at')) {
                    $table->timestamp('created_at')->nullable();
                }
                if (!Schema::hasColumn('faculty', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
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
        Schema::dropIfExists('faculty');
    }
}
