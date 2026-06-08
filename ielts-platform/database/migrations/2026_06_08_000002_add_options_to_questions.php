<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Holds the choice list for multiple_choice / matching / labelling questions.
            // Shape: ["A wildlife park", "A city centre", ...] OR
            //        [{"value":"A","label":"wildlife park"}, ...]
            if (!Schema::hasColumn('questions', 'options')) {
                $table->json('options')->nullable()->after('question_text');
            }
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('options');
        });
    }
};
