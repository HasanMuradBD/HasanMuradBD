<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained()->cascadeOnDelete();
            $table->enum('module', ['reading', 'listening']);
            $table->tinyInteger('section_number')->nullable();
            $table->smallInteger('sequence');
            $table->enum('question_type', [
                'true_false_not_given',
                'yes_no_not_given',
                'multiple_choice',
                'matching_headings',
                'matching_information',
                'matching_features',
                'sentence_completion',
                'summary_completion',
                'note_completion',
                'short_answer',
                'diagram_labelling',
                'form_completion',
                'map_labelling',
            ]);
            $table->text('question_text');
            $table->text('passage_reference')->nullable();
            $table->string('correct_answer', 500);
            $table->text('answer_explanation')->nullable();
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->timestamps();

            $table->index(['test_id', 'module', 'section_number']);
        });

        Schema::create('question_skill_tags', function (Blueprint $table) {
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('micro_skill_id')->constrained()->cascadeOnDelete();
            $table->primary(['question_id', 'micro_skill_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_skill_tags');
        Schema::dropIfExists('questions');
    }
};
