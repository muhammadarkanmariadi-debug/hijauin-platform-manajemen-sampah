<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreKategoriRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'jenis' => 'required|string|in:plastik,kertas,logam,kaca',
            'harga_per_kg' => 'required|numeric|min:0',
            'poin_per_kg' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
        ];
    }
}
