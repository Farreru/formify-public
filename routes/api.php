<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\v1\AuthController;
use App\Http\Controllers\API\v1\FormController;
use App\Http\Controllers\API\v1\QuestionController;
use App\Http\Controllers\API\v1\ResponseController;


// Auth Routes
Route::post('/v1/auth/login', [AuthController::class, 'login']);
Route::post('/v1/auth/register', [AuthController::class, 'register']);

Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::post('/v1/auth/logout', [AuthController::class, 'logout']);
    Route::get('/v1/forms', [FormController::class, 'getAllForms']);
    Route::get('/v1/forms/admin', [FormController::class, 'getAllFormsAdmin']);
    Route::post('/v1/forms', [FormController::class, 'createForm']);
    Route::get('/v1/forms/{formSlug}', [FormController::class, 'getFormDetail'])->where('formSlug', '[a-z0-9-]+');
    Route::delete('/v1/forms/{formSlug}', [FormController::class, 'deleteForm'])->where('formSlug', '[a-z0-9-]+');

    // Question Routes
    Route::post('/v1/forms/{formSlug}/questions', [QuestionController::class, 'addQuestion'])->where('formSlug', '[a-z0-9-]+');
    Route::delete('/v1/forms/{formSlug}/questions/{questionId}', [QuestionController::class, 'removeQuestion'])->where([
        'formSlug' => '[a-z0-9-]+',
        'questionId' => '[a-z0-9-]+',
    ]);

    // Response Routes
    Route::post('/v1/forms/{formSlug}/responses', [ResponseController::class, 'submitResponse'])->where('formSlug', '[a-z0-9-]+');

    Route::get('/v1/forms/{formSlug}/responses', [ResponseController::class, 'getAllResponses'])->where('formSlug', '[a-z0-9-]+');
});
Route::get('/v1/forms/public', [FormController::class, 'getPublicForms']);
Route::get('/v1/forms/{formSlug}/public', [FormController::class, 'getPublicFormDetail'])->where('formSlug', '[a-z0-9-]+');

// Routes for unauthenticated users (no middleware)
