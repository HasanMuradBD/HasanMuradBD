<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->foreignId('daily_task_id')->nullable()->constrained('daily_tasks')->nullOnDelete();
            $table->enum('status', ['in_progress', 'completed', 'abandoned', 'timed_out'])->default('in_progress');
            $table->timestamp('started_at');
            $table->timestamp('submitted_at')->nullable();
            $table->integer('time_taken_seconds')->nullable();
            $table->decimal('overall_band', 2, 1)->nullable();
            $table->boolean('is_diagnostic')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'test_id']);
        });

        Schema::create('test_attempt_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_attempt_id')->constrained()->cascadeOnDelete();
            $table->enum('module', ['reading', 'listening', 'writing', 'speaking']);
            $table->smallInteger('raw_score')->nullable();
            $table->decimal('band_score', 2, 1)->nullable();
            // Writing criteria
            $table->decimal('band_task_achievement', 2, 1)->nullable();
            $table->decimal('band_coherence_cohesion', 2, 1)->nullable();
            $table->decimal('band_lexical_resource', 2, 1)->nullable();
            $table->decimal('band_grammatical_range', 2, 1)->nullable();
            // Speaking criteria
            $table->decimal('band_fluency_coherence', 2, 1)->nullable();
            $table->decimal('band_lexical_resource_sp', 2, 1)->nullable();
            $table->decimal('band_grammatical_range_sp', 2, 1)->nullable();
            $table->decimal('band_pronunciation', 2, 1)->nullable();
            $table->enum('marked_by', ['system', 'self', 'instructor'])->default('system');
            $table->timestamp('marked_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('test_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_attempt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->string('user_answer', 500)->nullable();
            $table->boolean('is_correct')->nullable();
            $table->smallInteger('time_spent_seconds')->nullable();
            $table->boolean('flagged_for_review')->default(false);
            $table->string('error_tag', 100)->nullable();
            $table->timestamps();

            $table->index('test_attempt_id');
            $table->index('question_id');
            $table->index(['test_attempt_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_responses');
        Schema::dropIfExists('test_attempt_sections');
        Schema::dropIfExists('test_attempts');
    }
};
