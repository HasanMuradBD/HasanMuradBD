<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('test_attempts', function (Blueprint $table) {
            $table->json('writing_texts')->nullable()->after('is_diagnostic');
        });

        // Add audio_file_path to tests if not already present
        if (!Schema::hasColumn('tests', 'audio_file_path')) {
            Schema::table('tests', function (Blueprint $table) {
                $table->string('audio_file_path')->nullable()->after('is_active');
            });
        }
    }

    public function down(): void
    {
        Schema::table('test_attempts', function (Blueprint $table) {
            $table->dropColumn('writing_texts');
        });
        Schema::table('tests', function (Blueprint $table) {
            $table->dropColumn('audio_file_path');
        });
    }
};
