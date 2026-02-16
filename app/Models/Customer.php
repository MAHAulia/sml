<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "id",
        "name",
        "email",
        "phone",
        "address"
    ];

    protected function casts(): array
    {
        return [
            
        ];
    }
}
