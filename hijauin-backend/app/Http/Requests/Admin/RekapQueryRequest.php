<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RekapQueryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'month' => 'sometimes|integer|between:1,12',
            'year' => 'sometimes|integer|min:2020',
            'unit_id' => 'sometimes|integer|exists:bank_sampah_units,id',
            'all_units' => 'sometimes|boolean',
        ];
    }
}
