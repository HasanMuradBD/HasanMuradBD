<?php
namespace App\Http\Controllers\WhatsApp;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessInboundWhatsApp;
use Illuminate\Http\Request;

class InboundController extends Controller
{
    public function verify(Request $request)
    {
        $mode      = $request->query('hub_mode');
        $token     = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        if ($mode === 'subscribe' && $token === config('whatsapp.verify_token')) {
            return response($challenge, 200);
        }

        return response('Forbidden', 403);
    }

    public function handle(Request $request)
    {
        $payload = $request->all();

        // Signature verification
        $signature = $request->header('X-Hub-Signature-256');
        $expected  = 'sha256='.hash_hmac('sha256', $request->getContent(), config('whatsapp.app_secret'));

        if (!hash_equals($expected, (string) $signature)) {
            return response('Unauthorized', 401);
        }

        ProcessInboundWhatsApp::dispatch($payload)->onQueue('whatsapp');

        return response('OK', 200);
    }
}
