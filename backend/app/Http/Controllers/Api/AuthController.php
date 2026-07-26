<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8|confirmed',
            'role'      => 'required|in:customer,petugas,partner',
            'phone'     => 'nullable|string|max:20',
            'address'   => 'nullable|string',
            'zone'      => 'required_if:role,petugas|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $userData = [
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => bcrypt($request->password),
            'role'      => $request->role,
            'phone'     => $request->phone,
            'address'   => $request->address,
            'status'    => 'active',
        ];

        // Add zone for petugas
        if ($request->role === 'petugas') {
            $userData['zone'] = $request->zone;
        }

        $user = User::create($userData);

        if ($user) {
            // Generate token
            $token = auth()->guard('api')->login($user);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'token'   => $token,
                'user'    => $user,
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'Registration failed'
        ], 409);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'     => 'required|email',
            'password'  => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth()->guard('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = auth()->guard('api')->user();

        // Check if user is active
        if ($user->status !== 'active') {
            auth()->guard('api')->logout();
            return response()->json([
                'success' => false,
                'message' => 'Your account is ' . $user->status
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
        ], 200);
    }



    public function logout()
    {


        auth()->guard('api')->logout();

        $removetoken = JWTAuth::invalidate(JWTAuth::getToken());

        if ($removetoken) {
            return response()->json([
                'success' => true,
                'message' => 'User Logged Out Successfully',
            ], 200);
        }
    }

    public function me(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'masukkan bearer token',
            ], 401);
        }
        $user = auth()->guard('api')->user();


        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'token tidak valid',
            ], 401);
        }


        return response()->json([
            'success' => true,
            'user'    => $user
        ], 200);
    }
}
