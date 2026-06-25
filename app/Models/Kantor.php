<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kantor extends Model
{
    protected $fillable = [
        "code",
        "name",
        "address",
        "phone",
        "email"
    ];
}
