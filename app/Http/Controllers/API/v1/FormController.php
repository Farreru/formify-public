<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\AllowedDomain;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    public function createForm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'slug' => 'required',
            'description' => 'required',
            'limit_one_response' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors(),
            ], 422);
        }

        $form = Form::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'limit_one_response' => $request->limit_one_response,
            'creator_id' => $request->user()->id,
        ]);


        if ($request->has('allowed_domains')) {
            $allowedDomains = $request->allowed_domains;

            if (!empty($allowedDomains) && !empty(array_filter($allowedDomains))) {
                foreach ($allowedDomains as $domain) {
                    AllowedDomain::create([
                        'form_id' => $form->id,
                        'domain' => $domain,
                    ]);
                }
            }
        }

        $form->allowed_domains = $allowedDomains;


        return response()->json([
            'message' => 'Create form success',
            'form' => $form,
        ], 200);
    }

    public function getAllFormsAdmin(Request $request)
    {
        // Retrieve forms that were created by the authenticated user
        $forms = Form::where('creator_id', auth()->user()->id)
            ->get();

        return response()->json(['message' => 'Get all forms success', 'forms' => $forms], 200);
    }

    public function getAllForms(Request $request)
    {
        // Retrieve forms that were created by the authenticated user
        $forms = Form::all();

        return response()->json(['message' => 'Get all forms success', 'forms' => $forms], 200);
    }


    public function getFormDetail(Request $request, $formSlug)
    {
        $form = Form::with('questions', 'allowedDomains')->where('slug', $formSlug)->first();

        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        if (!$form->isAllowedToAccessForm($form)) {
            return response()->json(['message' => 'Forbidden access'], 403);
        }

        return response()->json(['message' => 'Get form success', 'form' => $form], 200);
    }
}
