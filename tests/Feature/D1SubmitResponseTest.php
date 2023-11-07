<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class D1SubmitResponseTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_d1a_submit_response_success()
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
            'answers' => [
                [ 'question_id' => 1, 'value' => 'Ica Amelia' ],
                [ 'question_id' => 2, 'value' => 'Bandung' ],
                [ 'question_id' => 3, 'value' => '2007-08-08' ],
                [ 'question_id' => 4, 'value' => 'Female' ],
            ],
        ];
        $response = $this->post('/api/v1/forms/biodata/responses', $params, $headers);
        $response
            ->assertStatus(200)
            ->assertSeeText('Submit response success')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_d1b_submit_response_invalid_field()
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
            'answers' => [
                [ 'question_id' => 2, 'value' => 'Bandung' ],
                [ 'question_id' => 3, 'value' => '2007-08-08' ],
                [ 'question_id' => 4, 'value' => 'Female' ],
            ],
        ];
        $response = $this->post('/api/v1/forms/biodata/responses', $params, $headers);
        $response
            ->assertStatus(422)
            ->assertSeeText('Invalid field')
            ->assertJsonStructure([
                'message',
                'errors',
            ]);
    }

    public function test_d1c_submit_response_domain_not_allowed_to_submit()
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

        $params = [
            'answers' => [
                [ 'question_id' => 1, 'value' => 'Ica Amelia' ],
                [ 'question_id' => 2, 'value' => 'Bandung' ],
                [ 'question_id' => 3, 'value' => '2007-08-08' ],
                [ 'question_id' => 4, 'value' => 'Female' ],
            ],
        ];
        $response = $this->post('/api/v1/forms/biodata/responses', $params, $headers);
        $response
            ->assertStatus(403)
            ->assertSeeText('Forbidden access')
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_d1d_submit_response_user_submit_twice()
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
            'answers' => [
                [ 'question_id' => 1, 'value' => 'Ica Amelia' ],
                [ 'question_id' => 2, 'value' => 'Bandung' ],
                [ 'question_id' => 3, 'value' => '2007-08-08' ],
                [ 'question_id' => 4, 'value' => 'Female' ],
            ],
        ];

        $this->post('/api/v1/forms/biodata/responses', $params, $headers);

        $response = $this->post('/api/v1/forms/biodata/responses', $params, $headers);
        $response
            ->assertStatus(401)
            ->assertSeeText("You can not submit twice")
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_d1e_submit_response_invalid_token()
    {
        $headers = [
            'Accept' => 'application/json'
        ];

        $headers['Authorization'] = "wrongtoken";

        $params = [
            'answers' => [
                [ 'question_id' => 1, 'value' => 'Ica Amelia' ],
                [ 'question_id' => 2, 'value' => 'Bandung' ],
                [ 'question_id' => 3, 'value' => '2007-08-08' ],
                [ 'question_id' => 4, 'value' => 'Female' ],
            ],
        ];
        $response = $this->post('/api/v1/forms/biodata/responses', $params, $headers);
        $response
            ->assertStatus(401)
            ->assertSeeText('Unauthenticated')
            ->assertJsonStructure([
                'message',
            ]);
    }
}
