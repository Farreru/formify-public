<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class D2GetAllResponsesTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_d2a_get_all_responses_success()
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

        $response = $this->get('/api/v1/forms/biodata/responses', $headers);

        $response
            ->assertStatus(200)
            ->assertSeeText('Get responses success')
            ->assertJsonStructure([
                'message',
                'responses' => [
                    [
                        'date',
                        'user' => ['name', 'email'],
                        'answers' => ['Name', 'Address', 'Born Date', 'Sex']
                    ]
                ]
            ]);
    }

    public function test_d2b_get_all_responses_invalid_form_slug()
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

        $response = $this->get('/api/v1/forms/wrongform/responses', $headers);

        $response
            ->assertStatus(404)
            ->assertSeeText('Form not found')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_d2c_get_all_responses_try_access_another_user_form()
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

        $response = $this->get('/api/v1/forms/biodata/responses', $headers);

        $response
            ->assertStatus(403)
            ->assertSeeText('Forbidden access')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_d2d_get_all_responses_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "wrong token";

        $response = $this->get('/api/v1/forms/biodata/responses', $headers);

        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
