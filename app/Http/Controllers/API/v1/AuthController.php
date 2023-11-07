<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * User login
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email', // Add 'unique' validation rule
            'password' => 'required',
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            if ($errors->has('email') && $errors->first('email') === 'The email has already been taken.') {
                return response()->json(["message" => "Email already used"], 422);
            }
            return response()->json(["message" => "Invalid field", "errors" => $errors], 422);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);

        $user->save();

        return response()->json([
            "message" => "Register success"
        ]);
    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(["message" => "Invalid field", "errors" => $validator->errors()], 422);
        }

        // Attempt to authenticate the user with the provided credentials
        if (Auth::attempt([
            'email' => $request->email,
            'password' => $request->password
        ])) {
            // Authentication successful, generate a token for the user
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                "message" => "Login success",
                "user" => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'accessToken' => $token
                ]
            ]);
        } else {
            // Authentication failed
            return response()->json(["message" => "Email or password incorrect"], 401);
        }
    }

    /**
     * User logout
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user->tokens()->delete()) {
            return response()->json([
                "message" => "Logout success"
            ], 200);
        } else {
            return response()->json([
                "message" => "Unauthenticated"
            ], 401);
        }
    }

    /**
     * Get the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
