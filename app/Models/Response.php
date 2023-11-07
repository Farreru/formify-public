<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Response extends Model
{

    public $timestamps = false;
    // Define the fillable fields for the Response model
    protected $fillable = [
        'form_id', 'user_id', 'date',
    ];

    // Define any additional properties, relationships, or methods as needed.

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'response_id', 'id');
    }

    public function form()
    {
        return $this->belongsTo(Form::class, 'form_id', 'id');
    }
}
