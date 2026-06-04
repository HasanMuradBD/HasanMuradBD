<?php

use Illuminate\Support\Facades\Schedule;

// WhatsApp coaching messages — 3 slots per day
Schedule::command('whatsapp:dispatch morning')->dailyAt('06:30')->timezone('UTC');
Schedule::command('whatsapp:dispatch midday')->dailyAt('13:00')->timezone('UTC');
Schedule::command('whatsapp:dispatch evening')->dailyAt('20:00')->timezone('UTC');
