<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use illuminate\Support\Facades\Auth;
use App\Models\wallets;
use illuminate\Support\Facades\Validator;

class WalletController extends Controller
{



    public function createWallet(Request $request){
        $userid = auth()->guard('api')->user()->id;



        if (!$userid) {
            return response()->json([
                'success' => false,
                'message' => 'masukkan bearer token',
            ], 401);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'user_id' => 'required',
            'currency' => 'required',
            'balance' => 'required',
            'type' => 'required',
            'is_active' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 422);
        }

        $wallet = wallets::create([
            'name' => $request->name,
            'user_id' => $userid,
            'currency' => $request->currency,
            'balance' => $request->balance,
            'type' => $request->type,
            'is_active' => $request->is_active,
        ]);

        return response()->json([
            'success' => true,
            'wallet'  => $wallet,
        ], 200);


    }


      public function getWallet()
    {
        $wallet = auth()->guard('api')->user()->wallets;


        return response()->json([
            'success' => true,
            'wallet'  => $wallet,
        ], 200);


    }
}
