<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class B2GetAllFormsTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_b2a_get_all_forms_success()
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

        $response = $this->get('/api/v1/forms', $headers);

        $response
            ->assertStatus(200)
            ->assertSeeText('Get all forms success')
            ->assertJsonStructure([
                'message',
                'forms' => [
                    [
                        'id', 'name', 'slug', 'description', 'limit_one_response', 'creator_id'
                    ]
                ]
            ]);
    }

    public function test_b2b_get_all_forms_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "wrongtoken";

        $response = $this->get('/api/v1/forms', $headers);

        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
