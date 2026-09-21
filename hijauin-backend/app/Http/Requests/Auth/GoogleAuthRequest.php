<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class GoogleAuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'full_name' => 'required|string|max:255',
            'photo_url' => 'nullable|string',
            'unit_id' => 'nullable|exists:bank_sampah_units,id',
        ];
    }
}
