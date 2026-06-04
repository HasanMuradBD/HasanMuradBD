<?php
namespace App\Console\Commands;

use App\Jobs\SendWhatsAppMessage;
use App\Models\StudyPlanDay;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class DispatchWhatsAppMessages extends Command
{
    protected $signature   = 'whatsapp:dispatch {slot : morning|midday|evening}';
    protected $description = 'Dispatch scheduled WhatsApp coaching messages';

    public function handle(): void
    {
        $slot = $this->argument('slot');

        $users = User::where('whatsapp_opted_in', true)
            ->whereNotNull('phone_e164')
            ->whereHas('studyPlans', fn($q) => $q->where('status', 'active'))
            ->with(['activePlan.days' => fn($q) => $q->where('calendar_date', today())])
            ->get();

        foreach ($users as $user) {
            $plan    = $user->activePlan;
            $today   = $plan?->days->first();
            $dayNum  = $plan?->currentDayNumber() ?? 1;
            $daysLeft = $user->daysUntilExam();

            match($slot) {
                'morning' => $this->sendMorning($user, $today, $dayNum, $daysLeft, $plan),
                'midday'  => $this->sendMidday($user, $today),
                'evening' => $this->sendEvening($user, $today, $dayNum),
                default   => null,
            };
        }

        $this->info("WhatsApp {$slot} messages dispatched to {$users->count()} users.");
    }

    private function sendMorning(User $user, $today, int $dayNum, int $daysLeft, $plan): void
    {
        if (!$today) return;

        $name  = explode(' ', $user->name)[0];
        $theme = $today->focus_theme ?? 'General Practice';
        $mins  = $today->estimated_minutes;

        $body = "Good morning, {$name}! 🎯\n\n"
            ."Day {$dayNum} of {$plan->total_days} — {$daysLeft} days to exam.\n\n"
            ."━━━━━━━━━━━━━━━━━━━\n"
            ."TODAY: {$theme}\n"
            ."Time needed: {$mins} minutes\n"
            ."━━━━━━━━━━━━━━━━━━━\n\n"
            ."Reply START to begin, or tell me a time (e.g. 7pm) and I'll remind you then.\n\n"
            ."👉 ".config('app.url');

        SendWhatsAppMessage::dispatch($user->phone_e164, $body)->onQueue('whatsapp');
    }

    private function sendMidday(User $user, $today): void
    {
        if (!$today) return;
        // Only send if day is still pending
        if ($today->status !== 'pending') return;

        $name = explode(' ', $user->name)[0];
        $theme = $today->focus_theme ?? 'today\'s session';

        $body = "{$name} — still time today for your session.\n\n"
            ."_{$theme}_ is where Band 6 candidates lose marks. "
            ."Today's drill targets exactly that.\n\n"
            ."👉 ".config('app.url')."\n\n"
            ."_(This is the only midday reminder I'll send today.)_";

        SendWhatsAppMessage::dispatch($user->phone_e164, $body)->onQueue('whatsapp');
    }

    private function sendEvening(User $user, $today, int $dayNum): void
    {
        if (!$today) return;

        $name      = explode(' ', $user->name)[0];
        $completed = $today->status === 'completed';

        if ($completed) {
            $body = "Day {$dayNum} done, {$name}. 🔥\n\n"
                ."Every session counts. Check your analytics to see today's impact:\n"
                ."👉 ".config('app.url')."/analytics\n\n"
                ."Rest well. Tomorrow at 6:30am. 🎯";
        } else {
            $body = "Day {$dayNum} closing, {$name}.\n\n"
                ."Today's session is still open — 30 mins can still happen:\n"
                ."👉 ".config('app.url')."\n\n"
                ."If life got in the way, reply MISSED and I'll rebalance your plan.\n"
                ."Or tell me what happened: BUSY / TIRED / FORGOT / OTHER";
        }

        SendWhatsAppMessage::dispatch($user->phone_e164, $body)->onQueue('whatsapp');
    }
}
