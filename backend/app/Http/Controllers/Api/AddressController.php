<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    /**
     * Display a listing of addresses for current user
     */
    public function index(Request $request)
    {
        $addresses = $request->user()
            ->addresses()
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    /**
     * Store a newly created address
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label' => 'nullable|string|max:100',
            'full_address' => 'required|string',
            'kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'notes' => 'nullable|string|max:500',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();


        // If this is the first address or explicitly set as default
        $isDefault = $request->is_default || $user->addresses()->count() === 0;

        $address = $user->addresses()->create([
            'label' => $request->label,
            'full_address' => $request->full_address,
            'kelurahan' => $request->kelurahan,
            'kecamatan' => $request->kecamatan,
            'city' => $request->city,
            'province' => $request->province,
            'postal_code' => $request->postal_code,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'notes' => $request->notes,
            'is_default' => $isDefault,
        ]);


        if ($isDefault) {

            $address->setAsDefault();
        }



        return response()->json([
            'success' => true,
            'message' => 'Address created successfully',
            'data' => $address
        ], 201);
    }

    /**
     * Display the specified address
     */
    public function show(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $address
        ]);
    }

    /**
     * Update the specified address
     */
    public function update(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'nullable|string|max:100',
            'full_address' => 'sometimes|required|string',
            'kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'city' => 'sometimes|required|string|max:100',
            'province' => 'sometimes|required|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $address->update($request->only([
            'label',
            'full_address',
            'kelurahan',
            'kecamatan',
            'city',
            'province',
            'postal_code',
            'latitude',
            'longitude',
            'notes'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }

    /**
     * Remove the specified address
     */
    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        // Don't allow deleting default address if there are other addresses
        if ($address->is_default && $request->user()->addresses()->count() > 1) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete default address. Please set another address as default first.'
            ], 400);
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully'
        ]);
    }

    /**
     * Set address as default
     */
    public function setDefault(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        $address->setAsDefault();

        return response()->json([
            'success' => true,
            'message' => 'Default address updated',
            'data' => $address
        ]);
    }
}
