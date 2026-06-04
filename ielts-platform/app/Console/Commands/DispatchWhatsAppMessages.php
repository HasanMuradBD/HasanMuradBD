<?php
namespace App\Console\Commands;

use App\Jobs\SendWhatsAppMessage;
use App\Models\User;
use App\Services\ChallengeProfileService;
use App\Services\WhatsAppCoachingScript;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class DispatchWhatsAppMessages extends Command
{
    protected $signature   = 'whatsapp:dispatch {slot : morning|midday|evening}';
    protected $description = 'Dispatch scheduled WhatsApp coaching messages';

    public function handle(WhatsAppCoachingScript $scripts, ChallengeProfileService $challenges): void
    {
        $slot = $this->argument('slot');

        $users = User::where('whatsapp_opted_in', true)
            ->whereNotNull('phone_e164')
            ->whereHas('studyPlans', fn($q) => $q->where('status', 'active'))
            ->with(['activePlan.days' => fn($q) => $q->where('calendar_date', today())])
            ->get();

        foreach ($users as $user) {
            $plan      = $user->activePlan;
            $today     = $plan?->days->first();
            $dayNum    = $plan?->currentDayNumber() ?? 1;
            $topCauses = Cache::remember("top_causes_{$user->id}", 86400,
                fn() => $challenges->topCauses($user, 3)
            );

            match($slot) {
                'morning' => $this->sendMorning($user, $today, $dayNum, $plan, $scripts, $topCauses),
                'midday'  => $this->sendMidday($user, $today, $dayNum, $scripts),
                'evening' => $this->sendEvening($user, $today, $dayNum),
                default   => null,
            };
        }

        $this->info("WhatsApp {$slot} messages dispatched to {$users->count()} users.");
    }

    private function sendMorning(User $user, $today, int $dayNum, $plan, WhatsAppCoachingScript $scripts, array $topCauses = []): void
    {
        if (!$today) return;

        $name      = explode(' ', $user->name)[0];
        $theme     = $today->focus_theme ?? 'General Practice';
        $mins      = $today->estimated_minutes;
        $daysLeft  = $user->daysUntilExam();
        $tip       = $scripts->getMorningTip($dayNum);
        $milestone = $scripts->getMilestone($dayNum, $plan->total_days);
        $nudge     = $scripts->getChallengeNudge($dayNum, $topCauses);

        $body = "Good morning, {$name}! 🎯\n\n";

        if ($milestone) {
            $body .= "{$milestone}\n\n";
        }

        $body .= "Day {$dayNum} of {$plan->total_days}";
        if ($daysLeft !== null) {
            $body .= " — {$daysLeft} day" . ($daysLeft === 1 ? '' : 's') . " to exam";
        }
        $body .= ".\n\n";

        $body .= "━━━━━━━━━━━━━━━━━━━\n"
              .  "TODAY: {$theme}\n"
              .  "Time needed: {$mins} minutes\n"
              .  "━━━━━━━━━━━━━━━━━━━\n\n";

        $body .= "💡 {$tip}\n\n";

        if ($nudge) {
            $body .= "{$nudge}\n\n";
        }

        $body .= "Reply START to begin, or tell me a time (e.g. 7pm) to get a reminder then.\n\n";
        $body .= "👉 " . config('app.url');

        SendWhatsAppMessage::dispatch($user->phone_e164, $body)->onQueue('whatsapp');

        // If today is a quiz day, cache the quiz and send it 30 min after morning message
        if ($scripts->hasQuiz($dayNum)) {
            $quiz = $scripts->getQuiz($dayNum);
            if ($quiz) {
                Cache::put("quiz_pending_{$user->id}", $quiz, now()->addHours(12));
                // Dispatch quiz question with a 30-minute delay
                SendWhatsAppMessage::dispatch($user->phone_e164, $quiz['question'])
                    ->onQueue('whatsapp')
                    ->delay(now()->addMinutes(30));
            }
        }
    }

    private function sendMidday(User $user, $today, int $dayNum, WhatsAppCoachingScript $scripts): void
    {
        if (!$today) return;
        if ($today->status !== 'pending') return;

        $name  = explode(' ', $user->name)[0];
        $theme = $today->focus_theme ?? "today's session";

        $body = "{$name} — still time today for your session.\n\n"
              . "_{$theme}_ is where Band 6 candidates lose marks. "
              . "Today's drill targets exactly that.\n\n"
              . "👉 " . config('app.url') . "\n\n"
              . "_(This is the only midday reminder I'll send today.)_";

        SendWhatsAppMessage::dispatch($user->phone_e164, $body)->onQueue('whatsapp');
    }

    private function sendEvening(User $user, $today, int $dayNum): void
    {
        if (!$today) return;

        $name      = explode(' ', $user->name)[0];
        $completed = $today->status === 'completed';

        if ($completed) {
            $body = "Day {$dayNum} done, {$name}. 🔥\n\n"
                  . "Every session counts. Check your analytics to see today's impact:\n"
                  . "👉 " . config('app.url') . "/analytics\n\n"
                  . "Rest well. Tomorrow at 6:30am. 🎯";
        } else {
            $body = "Day {$dayNum} closing, {$name}.\n\n"
                  . "Today's session is still open — even 30 focused minutes can move the needle:\n"
                  . "👉 " . config('app.url') . "\n\n"
                  . "If life got in the way, reply *MISSED* and I'll rebalance your plan.\n"
                  . "Or tell me what happened: BUSY / TIRED / FORGOT / OTHER";
        }

        SendWhatsAppMessage::dispatch($user->phone_e164, $body)->onQueue('whatsapp');
    }
}
