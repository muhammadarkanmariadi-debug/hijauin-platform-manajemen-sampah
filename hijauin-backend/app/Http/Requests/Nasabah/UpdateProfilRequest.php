<?php

namespace App\Http\Requests\Nasabah;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'photo_url' => 'sometimes|nullable|string',
            'alamat' => 'sometimes|nullable|string',
            'unit_id' => 'sometimes|nullable|integer|exists:bank_sampah_units,id',
        ];
    }
}
