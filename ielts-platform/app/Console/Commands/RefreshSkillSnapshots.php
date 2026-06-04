<?php
namespace App\Console\Commands;

use App\Models\User;
use App\Services\SkillSnapshotService;
use Illuminate\Console\Command;

class RefreshSkillSnapshots extends Command
{
    protected $signature   = 'analytics:refresh-snapshots {--user= : Refresh for a single user ID}';
    protected $description = 'Materialise skill accuracy snapshots for all active users';

    public function handle(SkillSnapshotService $service): void
    {
        $query = User::whereHas('testAttempts', fn($q) => $q->where('status', 'completed'));

        if ($userId = $this->option('user')) {
            $query->where('id', $userId);
        }

        $users = $query->pluck('id');
        $this->info("Refreshing snapshots for {$users->count()} users...");

        $bar = $this->output->createProgressBar($users->count());

        foreach ($users as $userId) {
            $service->refreshForUser($userId);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Skill snapshots refreshed.');
    }
}
