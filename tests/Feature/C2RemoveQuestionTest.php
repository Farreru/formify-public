<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class C2RemoveQuestionTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_c2a_remove_question_success()
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

        $response = $this->delete('/api/v1/forms/biodata/questions/1', [], $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Remove question success')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c2b_remove_question_invalid_form_slug()
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

        $response = $this->delete('/api/v1/forms/wrongform/questions/1', [], $headers);
        $response
            ->assertStatus(404)
            ->assertSeeText('Form not found')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c2c_remove_question_invalid_question_id()
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

        $response = $this->delete('/api/v1/forms/biodata/questions/wrongid', [], $headers);
        $response
            ->assertStatus(404)
            ->assertSeeText('Question not found')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c2d_remove_question_try_access_another_user_form()
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

        $response = $this->delete('/api/v1/forms/biodata/questions/1', [], $headers);
        $response
            ->assertStatus(403)
            ->assertSeeText('Forbidden access')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_c2e_remove_question_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "wrongtoken";

        $response = $this->delete('/api/v1/forms/biodata/questions/1', [], $headers);
        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
