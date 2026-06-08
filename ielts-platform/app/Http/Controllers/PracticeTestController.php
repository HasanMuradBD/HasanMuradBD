<?php
namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PracticeTestController extends Controller
{
    /** The four student-facing practice modules, in display order. */
    private const MODULES = ['reading', 'listening', 'writing', 'speaking'];

    public function index(Request $request)
    {
        // One grouped query instead of four — count + lightweight test list per module.
        $active = Test::where('is_active', true)
            ->whereIn('module', self::MODULES)
            ->orderByDesc('id')
            ->get(['id', 'title', 'module', 'duration_minutes', 'total_questions', 'academic_or_general']);

        $modules = [];
        foreach (self::MODULES as $module) {
            $tests = $active->where('module', $module)->values();

            $modules[$module] = [
                'count'      => $tests->count(),
                'first_test' => $tests->first()
                    ? ['id' => $tests->first()->id, 'title' => $tests->first()->title, 'duration_minutes' => $tests->first()->duration_minutes]
                    : null,
                'tests'      => $tests->map(fn ($t) => [
                    'id'                  => $t->id,
                    'title'               => $t->title,
                    'duration_minutes'    => $t->duration_minutes,
                    'total_questions'     => $t->total_questions,
                    'academic_or_general' => $t->academic_or_general,
                ])->all(),
            ];
        }

        return Inertia::render('PracticeTests', [
            'modules' => $modules,
        ]);
    }
}
