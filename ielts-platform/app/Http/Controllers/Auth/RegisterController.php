<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'                  => 'required|string|max:100',
            'email'                 => 'required|email|unique:users,email',
            'password'              => ['required', 'confirmed', Password::min(8)],
            'exam_date'             => 'required|date|after:today',
            'target_band'           => 'required|numeric|min:5|max:9|in:5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0',
            'phone_e164'            => 'nullable|regex:/^\+[1-9]\d{6,14}$/',
        ]);

        $user = User::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password'      => Hash::make($data['password']),
            'exam_date'     => $data['exam_date'],
            'target_band'   => $data['target_band'],
            'phone_e164'    => $data['phone_e164'] ?? null,
            'whatsapp_opted_in' => !empty($data['phone_e164']),
            'trial_ends_at' => now()->addDays(7),
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
