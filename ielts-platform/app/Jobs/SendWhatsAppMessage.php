<?php
namespace App\Jobs;

use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWhatsAppMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private readonly string $to,
        private readonly string $body,
        private readonly array  $buttons = [],
    ) {}

    public function handle(WhatsAppService $whatsapp): void
    {
        if ($this->buttons) {
            $whatsapp->sendButtons($this->to, $this->body, $this->buttons);
        } else {
            $whatsapp->sendText($this->to, $this->body);
        }
    }
}
