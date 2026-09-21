<?php

namespace App\Http\Requests\Nasabah;

use Illuminate\Foundation\Http\FormRequest;

class StoreSetoranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => 'required|date',
            'catatan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.kategori_sampah_id' => 'required|exists:kategori_sampah,id',
            'items.*.berat_kg_estimasi' => 'required|numeric|gt:0',
        ];
    }
}
