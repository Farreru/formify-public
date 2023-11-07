<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    public $timestamps = false;

    // Define the fillable fields for the Form model
    protected $fillable = [
        'name', 'slug', 'description', 'limit_one_response', 'creator_id',
    ];

    // Define any additional properties, relationships, or methods as needed.

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function allowedDomains()
    {
        return $this->hasMany(AllowedDomain::class);
    }

    public function responses()
    {
        return $this->hasMany(Response::class); // A form can have multiple responses
    }

    public function isAllowedToSubmitResponse()
    {
        // Get the user's email domain
        $userEmail = auth()->user()->email;
        $userDomain = explode('@', $userEmail)[1];

        // Check if the user's domain is allowed
        foreach ($this->allowedDomains as $allowedDomain) {
            if ($allowedDomain->domain === $userDomain) {
                return true;
            }
        }

        // If allowed_domains is empty, the form is open to all
        if (empty($allowedDomain->domain)) {
            return true;
        }

        // If no allowed domains or no match found, return false
        return false;
    }

    public function isAllowedToAccessResponses()
    {
        // Implement this logic as needed
        // Get the user's email domain
        $userEmail = auth()->user()->email;
        $userDomain = explode('@', $userEmail)[1];

        // Check if the user's domain is allowed
        foreach ($this->allowedDomains as $allowedDomain) {
            if ($allowedDomain->domain === $userDomain) {
                return true;
            }
        }

        // If allowed_domains is empty, the form is open to all
        if (empty($allowedDomain->domain)) {
            return true;
        }

        // If no allowed domains or no match found, return false
        return false;
    }

    public function isAllowedToAccessForm()
    {
        // Implement this logic as needed
        // Get the user's email domain
        $userEmail = auth()->user()->email;
        $userDomain = explode('@', $userEmail)[1];

        // Check if the user's domain is allowed
        foreach ($this->allowedDomains as $allowedDomain) {
            if ($allowedDomain->domain === $userDomain) {
                return true;
            }
        }

        // If allowed_domains is empty, the form is open to all
        if (empty($allowedDomain->domain)) {
            return true;
        }

        // If no allowed domains or no match found, return false
        return false;
    }
}
