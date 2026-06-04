<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    private string $baseUrl;
    private string $token;
    private string $phoneNumberId;

    public function __construct()
    {
        $this->token         = config('whatsapp.token');
        $this->phoneNumberId = config('whatsapp.phone_number_id');
        $this->baseUrl       = "https://graph.facebook.com/v19.0/{$this->phoneNumberId}/messages";
    }

    public function sendText(string $to, string $body): bool
    {
        return $this->send([
            'messaging_product' => 'whatsapp',
            'to'                => $to,
            'type'              => 'text',
            'text'              => ['preview_url' => false, 'body' => $body],
        ]);
    }

    public function sendButtons(string $to, string $body, array $buttons): bool
    {
        $rows = array_map(fn($b, $i) => [
            'type'  => 'reply',
            'reply' => ['id' => "btn_{$i}", 'title' => $b],
        ], $buttons, array_keys($buttons));

        return $this->send([
            'messaging_product' => 'whatsapp',
            'to'                => $to,
            'type'              => 'interactive',
            'interactive'       => [
                'type'   => 'button',
                'body'   => ['text' => $body],
                'action' => ['buttons' => array_slice($rows, 0, 3)],
            ],
        ]);
    }

    private function send(array $payload): bool
    {
        try {
            $response = Http::withToken($this->token)
                ->timeout(10)
                ->post($this->baseUrl, $payload);

            if (!$response->successful()) {
                Log::warning('WhatsApp send failed', ['status' => $response->status(), 'body' => $response->body()]);
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('WhatsApp exception', ['message' => $e->getMessage()]);
            return false;
        }
    }
}
