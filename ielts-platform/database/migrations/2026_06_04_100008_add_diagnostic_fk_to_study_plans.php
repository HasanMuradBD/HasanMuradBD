<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('study_plans', function (Blueprint $table) {
            $table->foreign('diagnostic_attempt_id')
                ->references('id')->on('test_attempts')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('study_plans', function (Blueprint $table) {
            $table->dropForeign(['diagnostic_attempt_id']);
        });
    }
};
