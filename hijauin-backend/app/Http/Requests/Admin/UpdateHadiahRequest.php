<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHadiahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|nullable|string',
            'poin_diperlukan' => 'sometimes|integer|min:1',
            'stok' => 'sometimes|integer|min:0',
        ];
    }
}
