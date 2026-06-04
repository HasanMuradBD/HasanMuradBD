<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('writing_prompts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->enum('task_number', ['task_1', 'task_2']);
            $table->text('prompt_text');
            $table->text('data_description')->nullable();
            $table->text('band_7_model_answer')->nullable();
            $table->text('band_8_model_answer')->nullable();
            $table->tinyInteger('time_allowed_minutes')->default(40);
            $table->smallInteger('word_target_min')->default(250);
            $table->timestamps();
        });

        Schema::create('speaking_prompts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->enum('part_number', ['part_1', 'part_2', 'part_3']);
            $table->string('topic', 100);
            $table->text('prompt_text');
            $table->json('follow_up_questions')->nullable();
            $table->text('cue_card_notes')->nullable();
            $table->smallInteger('time_allowed_seconds')->default(120);
            $table->text('band_7_model_transcript')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('speaking_prompts');
        Schema::dropIfExists('writing_prompts');
    }
};
