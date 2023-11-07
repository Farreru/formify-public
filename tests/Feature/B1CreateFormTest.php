<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class B1CreateFormTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_b1a_create_a_form_success()
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
            'name' => 'New Form',
            'slug' => 'new-form',
            'description' => 'New form description',
            'allowed_domains' => ['webtech.id'],
            'limit_one_response' => true,
        ];

        $response = $this->post('/api/v1/forms', $params, $headers);

        $response
            ->assertStatus(200)
            ->assertSeeText('Create form success')
            ->assertJsonStructure([
                'message',
                'form' => ['name', 'slug', 'description', 'limit_one_response', 'creator_id']
            ]);
    }

    public function test_b1b_create_a_form_invalid_field()
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
            'name' => 'New Form',
            'slug' => 'new-form',
            'description' => 'New form description',
            'allowed_domains' => ['webtech.id'],
            'limit_one_response' => true,
        ];

        $this->post('/api/v1/forms', $params, $headers);

        $params['name'] = null;
        $params['description'] = null;
        $params['allowed_domains'] = "wrongarray";
        $params['limit_one_response'] = "wrongbool";

        $response = $this->post('/api/v1/forms', $params, $headers);

        $response
            ->assertStatus(422)
            ->assertSeeText('Invalid field')
            ->assertJsonStructure([
                'message',
                'errors'
            ]);
    }

    public function test_b1c_create_a_form_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "Bearer wrongtoken";

        $params = [
            'name' => 'New Form',
            'slug' => 'new-form',
            'description' => 'New form description',
            'allowed_domains' => ['webtech.id'],
            'limit_one_response' => true,
        ];

        $response = $this->post('/api/v1/forms', $params, $headers);

        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
