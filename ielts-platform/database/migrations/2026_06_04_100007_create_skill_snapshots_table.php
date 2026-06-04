<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('micro_skill_id')->constrained()->cascadeOnDelete();
            $table->date('snapshot_date');
            $table->smallInteger('attempts_count');
            $table->smallInteger('correct_count');
            $table->decimal('accuracy_pct', 5, 2);
            $table->decimal('estimated_band', 2, 1)->nullable();
            $table->timestamp('computed_at');
            $table->timestamps();

            $table->unique(['user_id', 'micro_skill_id', 'snapshot_date']);
            $table->index(['user_id', 'snapshot_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_snapshots');
    }
};
