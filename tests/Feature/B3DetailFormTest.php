<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class B3DetailFormTest extends TestCase
{
    use DatabaseTransactions;

    public function test_b3a_get_detail_form_success()
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

        $response = $this->get('/api/v1/forms/biodata', $headers);

        $response
            ->assertStatus(200)
            ->assertSeeText('Get form success')
            ->assertJsonStructure([
                'message',
                'form' => [
                    'id', 'name', 'slug', 'description', 'limit_one_response', 'creator_id', 'questions', 'allowed_domains'
                ]
            ]);
    }

    public function test_b3b_get_detail_form_invalid_form_slug()
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

        $response = $this->get('/api/v1/forms/wrongform', $headers);

        $response
            ->assertStatus(404)
            ->assertSeeText('Form not found')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_b3c_get_detail_domain_not_allowed_to_submit()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user3@worldskills.org',
            'password' => 'password3',
        ];

        $login = $this->post('/api/v1/auth/login', $credentials, $headers);

        $accessToken = $login->json('accessToken');

        $headers['Authorization'] = "Bearer $accessToken";

        $response = $this->get('/api/v1/forms/biodata', $headers);

        $response
            ->assertStatus(403)
            ->assertSeeText('Forbidden access')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_b3d_get_detail_form_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "wrongtoken";

        $response = $this->get('/api/v1/forms/biodata', $headers);

        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
