<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['active', 'completed', 'abandoned'])->default('active');
            $table->enum('generated_from', ['diagnostic', 'manual'])->default('manual');
            $table->unsignedBigInteger('diagnostic_attempt_id')->nullable();
            $table->date('start_date');
            $table->date('exam_date');
            $table->tinyInteger('total_days');
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('study_plan_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_plan_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('day_number');
            $table->date('calendar_date');
            $table->enum('focus_module', ['reading', 'listening', 'writing', 'speaking', 'mixed', 'full_mock'])->nullable();
            $table->string('focus_theme', 100)->nullable();
            $table->smallInteger('estimated_minutes')->default(60);
            $table->enum('status', ['pending', 'in_progress', 'completed', 'missed', 'rescheduled'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->string('missed_reason', 255)->nullable();
            $table->timestamps();

            $table->unique(['study_plan_id', 'day_number']);
            $table->index(['study_plan_id', 'calendar_date']);
        });

        Schema::create('daily_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_plan_day_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('sequence');
            $table->enum('task_type', [
                'timed_test',
                'self_mark',
                'vocabulary_review',
                'descriptor_study',
                'error_log_review',
            ]);
            $table->string('title', 150);
            $table->text('instructions')->nullable();
            $table->smallInteger('duration_minutes');
            $table->foreignId('linked_test_id')->nullable()->constrained('tests')->nullOnDelete();
            $table->enum('status', ['pending', 'completed', 'skipped'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_tasks');
        Schema::dropIfExists('study_plan_days');
        Schema::dropIfExists('study_plans');
    }
};
