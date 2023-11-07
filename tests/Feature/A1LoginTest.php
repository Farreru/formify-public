<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class A1LoginTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_a1a_login_success()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user1@webtech.id',
            'password' => 'password1',
        ];

        $response = $this->post('/api/v1/auth/login', $credentials, $headers);

        $response
            ->assertStatus(200)
            ->assertSeeText('Login success')
            ->assertJsonStructure([
                'message',
                'user' => [
                    'name',
                    'email',
                    'accessToken',
                ]
            ]);
            
    }

    public function test_a1b_login_invalid_field()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user1',
            'password' => null,
        ];

        $response = $this->post('/api/v1/auth/login', $credentials, $headers);

        $response
            ->assertStatus(422)
            ->assertSeeText('Invalid field')
            ->assertJsonStructure([
                'message',
                'errors'
            ]);
            
    }

    public function test_a1c_login_failed()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $credentials = [
            'email'    => 'user1@webtech.id',
            'password' => 'wrongpass',
        ];

        $response = $this->post('/api/v1/auth/login', $credentials, $headers);

        $response
            ->assertStatus(401)
            ->assertSeeText('Email or password incorrect')
            ->assertJsonStructure([
                'message'
            ]);
            
    }
}
