<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{

    public $timestamps = false;

    // Define the fillable fields for the Question model
    protected $fillable = [
        'name', 'choice_type', 'choices', 'is_required', 'form_id',
    ];

    // Define any additional properties, relationships, or methods as needed.

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
