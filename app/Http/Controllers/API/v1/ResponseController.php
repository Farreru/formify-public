<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Response;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ResponseController extends Controller
{
    public function submitResponse($formSlug, Request $request)
    {
        $form = Form::where('slug', $formSlug)->first();

        // Check if the user has already submitted a response for this form
        $existingResponse = Response::where('form_id', $form->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingResponse && $form->limit_one_response) {
            return response()->json(['message' => 'You can not submit twice'], 401);
        }

        // Check if the user is allowed to submit a response for this form
        if (!$form->isAllowedToSubmitResponse()) {
            return response()->json(['message' => 'Forbidden access'], 403);
        }


        // Validate the request data
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.value' => 'nullable'
        ]);


        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid field', 'errors' => $validator->errors()], 422);
        }


        // Check if all required questions are answered
        $questionIdsInForm = $form->questions->pluck('id')->toArray();
        $answeredQuestionIds = collect($request->input('answers'))->pluck('question_id')->toArray();

        $unansweredQuestionIds = array_diff($questionIdsInForm, $answeredQuestionIds);

        foreach ($unansweredQuestionIds as $unansweredQuestionId) {
            $unansweredQuestion = $form->questions->firstWhere('id', $unansweredQuestionId);
            if ($unansweredQuestion->is_required) {
                return response()->json(['message' => 'Invalid field', 'errors' => 'All Field Must Be Filled'], 422);
            }
        }


        // Create a new response
        $response = new Response([
            'form_id' => $form->id,
            'user_id' => Auth::id(),
            'date' => now(),
        ]);
        $response->save();

        // Save the answers for the response
        foreach ($request->input('answers') as $answerData) {
            $answer = new Answer([
                'response_id' => $response->id,
                'question_id' => $answerData['question_id'],
                'value' => $answerData['value']
            ]);
            $answer->save();
        }

        return response()->json(['message' => 'Submit response success'], 200);
    }

    public function getAllResponses($formSlug)
    {
        $form = Form::where('slug', $formSlug)->first();

        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        // Check if the user is allowed to access responses for this form
        if (!$form->isAllowedToAccessForm()) {
            return response()->json(['message' => 'Forbidden access'], 403);
        }

        $responses = $form->responses()
            ->with('answers:response_id,question_id,value')
            ->get();

        $formattedResponses = $responses->map(function ($response) {
            $answers = $response->answers->map(function ($answer) {
                return [$answer->question->name => $answer->value];
            })->reduce(function ($carry, $item) {
                return array_merge($carry, $item);
            }, []);

            return [
                'date' => $response->date,
                'user' => [
                    'name' => $response->user->name,
                    'email' => $response->user->email
                ],
                'answers' => $answers,
            ];
        });

        return response()->json(['message' => 'Get responses success', 'responses' => $formattedResponses], 200);
    }
}
