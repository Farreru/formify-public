<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class C1AddQuestionTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic feature test example.
     *
     * @return void
     */

    public function test_c1a_add_question_success()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user1@webtech.id',
            'password' => 'password1',
        ];

        $login = $this->post('/api/v1/auth/login', $credentials, $headers);

        $accessToken = $login->json('accessToken');

        $headers['Authorization'] = "Bearer $accessToken";

        // Add Short Answer
        $params = [
            'name'        => 'Short Answer Example',
            'choice_type' => 'short answer',
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Add question success')
            ->assertJsonStructure([
                'message',
                'question' => ['name', 'choice_type', 'is_required', 'form_id', 'id']
            ]);

        // Add Paragraph Test
        $params = [
            'name'        => 'Paragraph Example',
            'choice_type' => 'paragraph',
            'is_required' => false,
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Add question success')
            ->assertJsonStructure([
                'message',
                'question' => ['name', 'choice_type', 'is_required', 'form_id', 'id']
            ]);

        // Add Multiple Choice Test
        $params = [
            'name'        => 'Multiple Choice Example',
            'choice_type' => 'multiple choice',
            'choices'     => ['first choice', 'second choice', 'third choice'],
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Add question success')
            ->assertJsonStructure([
                'message',
                'question' => ['name', 'choice_type', 'is_required', 'form_id', 'id']
            ]);

        // Add Dropdown Test
        $params = [
            'name'        => 'Dropdown Example',
            'choice_type' => 'dropdown',
            'choices'     => ['first choice', 'second choice', 'third choice'],
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Add question success')
            ->assertJsonStructure([
                'message',
                'question' => ['name', 'choice_type', 'is_required', 'form_id', 'id']
            ]);

        // Add Checkboxes Test
        $params = [
            'name'        => 'Checkboxes Example',
            'choice_type' => 'checkboxes',
            'choices'     => ['first choice', 'second choice', 'third choice'],
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Add question success')
            ->assertJsonStructure([
                'message',
                'question' => ['name', 'choice_type', 'is_required', 'form_id', 'id']
            ]);
    }

    public function test_c1b_add_question_invalid_field()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user1@webtech.id',
            'password' => 'password1',
        ];

        $login = $this->post('/api/v1/auth/login', $credentials, $headers);

        $accessToken = $login->json('accessToken');

        $headers['Authorization'] = "Bearer $accessToken";

        // Short answer & paragraph
        $params = [
            'name'        => null,
            'choice_type' => null,
            'is_required' => 'wrongbool'
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(422)
            ->assertSeeText('Invalid field')
            ->assertJsonStructure([
                'message',
            ]);

        // Multiple
        $params = [
            'name'        => 'Multiple Choice Example',
            'choice_type' => 'multiple choice',
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/biodata/questions', $params, $headers);
        $response
            ->assertStatus(422)
            ->assertSeeText('Invalid field')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c1c_add_question_invalid_form_slug()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user1@webtech.id',
            'password' => 'password1',
        ];

        $login = $this->post('/api/v1/auth/login', $credentials, $headers);

        $accessToken = $login->json('accessToken');

        $headers['Authorization'] = "Bearer $accessToken";

        $params = [
            'name'        => 'Short Answer Example',
            'choice_type' => 'short answer',
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/wrongfrom/questions', $params, $headers);
        $response
            ->assertStatus(404)
            ->assertSeeText('Form not found')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c1d_add_question_try_access_another_user_form()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user2@webtech.id',
            'password' => 'password2',
        ];

        $login = $this->post('/api/v1/auth/login', $credentials, $headers);

        $accessToken = $login->json('accessToken');

        $headers['Authorization'] = "Bearer $accessToken";

        $params = [
            'name'        => 'Short Answer Example',
            'choice_type' => 'short answer',
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/wrongfrom/questions', $params, $headers);
        $response
            ->assertStatus(404)
            ->assertSeeText('Form not found')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c1e_add_question_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "wrongtoken";

        $params = [
            'name'        => 'Short Answer Example',
            'choice_type' => 'short answer',
            'is_required' => true,
        ];
        $response = $this->post('/api/v1/forms/wrongfrom/questions', $params, $headers);
        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
