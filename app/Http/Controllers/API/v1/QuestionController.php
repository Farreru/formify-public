<?php
// app/Http/Controllers/API/v1/QuestionController.php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\User;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    // ...

    public function addQuestion(Request $request, $formSlug)
    {
        // Validation rules...
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'choice_type' => 'required|in:short answer,paragraph,date,time,multiple choice,dropdown,checkboxes',
            'choices' => 'nullable|required_if:choice_type,multiple choice,dropdown,checkboxes|array',
            'is_required' => 'nullable|required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Convert choices array to a pipe-separated string if it's present
        if ($request->has('choices') && is_array($request->choices)) {
            $request->merge([
                'choices' => implode(',', $request->choices),
            ]);
        } elseif ($request->choice_type !== 'multiple choice' && $request->choice_type !== 'dropdown' && $request->choice_type !== 'checkboxes') {
            // If choice_type doesn't require choices, set choices to null
            $request->merge([
                'choices' => null,
            ]);
        }

        $form = Form::where('slug', $formSlug)->first();

        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        // ...

        $question = Question::create([
            'name' => $request->name,
            'choice_type' => $request->choice_type,
            'choices' => $request->choices,
            'is_required' => $request->is_required,
            'form_id' => $form->id,
        ]);

        // Convert choices pipe-separated string back to an array
        if ($question->choice_type === 'multiple choice' || $question->choice_type === 'dropdown' || $question->choice_type === 'checkboxes') {
            $question->choices = explode(',', $question->choices);
        }

        return response()->json(['message' => 'Add question success', 'question' => $question], 200);
    }



    // ...


    public function removeQuestion(Request $request, $formSlug, $questionId)
    {

        $user = auth()->user();

        $form = Form::where('slug', $formSlug)->first();

        // Check if the form exists
        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        if ($form->creator_id !== $user->id) {
            return response()->json(['message' => 'Forbidden access'], 403);
        }

        // Check if the question exists and belongs to the given form
        $question = $form->questions()->find($questionId);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        // Remove the question

        if ($question->delete()) {

            return response()->json(['message' => 'Remove question success'], 200);
        }
    }



    // Add other methods here based on your requirements

}
