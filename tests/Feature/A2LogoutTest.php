<?php
// tests/Feature/A2LogoutTest.php

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class A2LogoutTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_a2a_logout_success()
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

        $response = $this->post('/api/v1/auth/logout', [], $headers);

        $response
            ->assertStatus(200)
            ->assertSeeText('Logout success')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_a2b_logout_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "Bearer wrongtoken";

        $response = $this->post('/api/v1/auth/logout', [], $headers);

        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
