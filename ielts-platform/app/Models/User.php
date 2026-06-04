<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, Billable;

    protected $fillable = [
        'name', 'email', 'password',
        'target_band', 'target_band_reading', 'target_band_writing',
        'target_band_listening', 'target_band_speaking',
        'exam_date', 'phone_e164', 'whatsapp_opted_in',
        'whatsapp_nudge_time', 'timezone',
        'onboarding_completed_at', 'trial_ends_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'onboarding_completed_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'exam_date' => 'date',
            'whatsapp_opted_in' => 'boolean',
            'target_band' => 'decimal:1',
            'target_band_reading' => 'decimal:1',
            'target_band_writing' => 'decimal:1',
            'target_band_listening' => 'decimal:1',
            'target_band_speaking' => 'decimal:1',
            'password' => 'hashed',
        ];
    }

    public function studyPlans()
    {
        return $this->hasMany(StudyPlan::class);
    }

    public function activePlan()
    {
        return $this->hasOne(StudyPlan::class)->where('status', 'active')->latestOfMany();
    }

    public function testAttempts()
    {
        return $this->hasMany(TestAttempt::class);
    }

    public function skillSnapshots()
    {
        return $this->hasMany(SkillSnapshot::class);
    }

    public function isOnTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    public function trialDaysLeft(): int
    {
        if (!$this->trial_ends_at) return 0;
        return max(0, (int) now()->diffInDays($this->trial_ends_at, false));
    }

    public function hasAccess(): bool
    {
        return $this->subscribed('default') || $this->isOnTrial();
    }

    public function daysUntilExam(): int
    {
        if (!$this->exam_date) return 0;
        return max(0, (int) now()->diffInDays($this->exam_date, false));
    }
}
