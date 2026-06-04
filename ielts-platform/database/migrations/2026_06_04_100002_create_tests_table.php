<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->enum('type', ['diagnostic', 'module_practice', 'full_mock', 'mini_drill']);
            $table->enum('module', ['reading', 'listening', 'writing', 'speaking', 'full']);
            $table->enum('academic_or_general', ['academic', 'general', 'both'])->default('academic');
            $table->smallInteger('duration_minutes');
            $table->smallInteger('total_questions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
