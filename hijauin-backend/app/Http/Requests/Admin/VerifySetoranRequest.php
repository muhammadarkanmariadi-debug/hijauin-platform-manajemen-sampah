<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VerifySetoranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.detail_setor_id' => 'required|exists:detail_setor,id',
            'items.*.berat_kg_real' => 'required|numeric|min:0',
            'items.*.accepted' => 'required|boolean',
        ];
    }
}
