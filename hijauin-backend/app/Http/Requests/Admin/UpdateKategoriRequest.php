<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKategoriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'sometimes|string|max:255',
            'jenis' => 'sometimes|string|in:plastik,kertas,logam,kaca',
            'harga_per_kg' => 'sometimes|numeric|min:0',
            'poin_per_kg' => 'sometimes|integer|min:0',
            'deskripsi' => 'sometimes|nullable|string',
            'foto_url' => 'sometimes|nullable|string|max:2048',
        ];
    }
}
