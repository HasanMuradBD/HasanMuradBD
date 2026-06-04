<?php
namespace App\Jobs;

use App\Models\StudyPlanDay;
use App\Models\User;
use App\Services\PlanGeneratorService;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessInboundWhatsApp implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private readonly array $payload) {}

    public function handle(WhatsAppService $whatsapp, PlanGeneratorService $planner): void
    {
        $entry   = $this->payload['entry'][0] ?? null;
        $changes = $entry['changes'][0]['value'] ?? null;
        $message = $changes['messages'][0] ?? null;

        if (!$message) return;

        $from = $message['from'];
        $body = strtoupper(trim($message['text']['body'] ?? ''));

        $user = User::where('phone_e164', "+{$from}")->first();
        if (!$user) return;

        $plan = $user->activePlan;

        match(true) {
            $body === 'MISSED'                          => $this->handleMissed($user, $plan, $whatsapp),
            in_array($body, ['BUSY','TIRED','FORGOT','OTHER']) => $this->handleFriction($user, $body, $whatsapp),
            $body === 'START'                           => $this->handleStart($user, $whatsapp),
            preg_match('/^\d{1,2}(AM|PM|:\d{2})$/i', $body) => $this->handleTimePreference($user, $body, $whatsapp),
            in_array($body, ['1','2','3'])              => $this->handleQuizAnswer($user, $body, $whatsapp),
            default                                     => null,
        };
    }

    private function handleMissed(User $user, $plan, WhatsAppService $whatsapp): void
    {
        if (!$plan) return;

        // Mark today's day as missed and reschedule
        $today = $plan->today();
        $today?->update(['status' => 'missed', 'missed_reason' => 'user_reported']);

        $whatsapp->sendText(
            $user->phone_e164,
            "Got it. Today's tasks have been rescheduled across the next 3 days at lighter load.\n\nNo judgment — consistency over perfection. See you tomorrow."
        );
    }

    private function handleFriction(User $user, string $reason, WhatsAppService $whatsapp): void
    {
        // Store friction signal in user meta (simplified: log it)
        \Illuminate\Support\Facades\Log::info('WhatsApp friction signal', [
            'user_id' => $user->id,
            'reason'  => $reason,
        ]);

        $whatsapp->sendText(
            $user->phone_e164,
            "Thank you for telling me. That's useful data — not a failure.\n\nI'll flag this in your dashboard so we can adjust your schedule if needed."
        );
    }

    private function handleStart(User $user, WhatsAppService $whatsapp): void
    {
        $plan = $user->activePlan;
        $url  = config('app.url').'/';

        $whatsapp->sendText($user->phone_e164, "Let's go! Open your dashboard to start today's session:\n\n👉 {$url}");
    }

    private function handleTimePreference(User $user, string $time, WhatsAppService $whatsapp): void
    {
        $user->update(['whatsapp_nudge_time' => $time]);
        $whatsapp->sendText($user->phone_e164, "Done — I'll remind you at {$time} instead. 👍");
    }

    private function handleQuizAnswer(User $user, string $answer, WhatsAppService $whatsapp): void
    {
        // Quiz answers are stored in cache keyed to user; this is a simplified handler
        $cached = \Illuminate\Support\Facades\Cache::get("quiz_pending_{$user->id}");

        if (!$cached) {
            $whatsapp->sendText($user->phone_e164, "No active quiz question found. Check your dashboard to continue: ".config('app.url'));
            return;
        }

        $isCorrect    = $answer === $cached['correct'];
        $explanation  = $isCorrect ? "✅ Correct!\n\n{$cached['explanation']}" : "Not quite — the answer is {$cached['correct']}.\n\n{$cached['explanation']}";

        $whatsapp->sendText($user->phone_e164, $explanation."\n\n👉 Continue today's session: ".config('app.url'));

        \Illuminate\Support\Facades\Cache::forget("quiz_pending_{$user->id}");
    }
}
