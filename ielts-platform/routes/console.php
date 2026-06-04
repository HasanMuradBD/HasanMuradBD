<?php

use Illuminate\Support\Facades\Schedule;

// WhatsApp coaching — 3 slots per day (times in UTC)
Schedule::command('whatsapp:dispatch morning')->dailyAt('06:30')->timezone('UTC');
Schedule::command('whatsapp:dispatch midday')->dailyAt('13:00')->timezone('UTC');
Schedule::command('whatsapp:dispatch evening')->dailyAt('20:00')->timezone('UTC');

// Detect missed study days (runs at 00:05 UTC — gives users until midnight)
Schedule::command('plans:detect-missed')->dailyAt('00:05')->timezone('UTC');

// Materialise skill snapshots nightly (runs after missed-day detection)
Schedule::command('analytics:refresh-snapshots')->dailyAt('00:30')->timezone('UTC');
