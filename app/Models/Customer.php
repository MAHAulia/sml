<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Customer extends Model
{
    use SoftDeletes, HasFactory, Notifiable;

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
