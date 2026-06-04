<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * @param  array<string, string>  $input
     * @throws ValidationException
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name'          => ['required', 'string', 'max:100'],
            'email'         => ['required', 'email', 'max:150', Rule::unique(User::class)],
            'password'      => $this->passwordRules(),
            'exam_date'     => ['required', 'date', 'after:today'],
            'target_band'   => ['required', 'numeric', 'in:5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0'],
            'phone_e164'    => ['nullable', 'regex:/^\+[1-9]\d{6,14}$/'],
        ])->validate();

        return User::create([
            'name'              => $input['name'],
            'email'             => $input['email'],
            'password'          => Hash::make($input['password']),
            'exam_date'         => $input['exam_date'],
            'target_band'       => $input['target_band'],
            'phone_e164'        => $input['phone_e164'] ?? null,
            'whatsapp_opted_in' => !empty($input['phone_e164']),
            'trial_ends_at'     => now()->addDays(7),
        ]);
    }
}
