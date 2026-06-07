<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_tips', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['vocabulary', 'grammar', 'exam_tip']);
            $table->string('title');
            $table->text('content');
            $table->string('example')->nullable();
            $table->date('target_date')->nullable()->unique();
            $table->boolean('is_fallback')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_tips');
    }
};
