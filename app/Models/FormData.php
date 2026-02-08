<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormData extends Model
{
    //
    protected $fillable = [
        'formulir_id',
        'formulir_data',
        'submitted_via',
        'ip_address',
        'user_agent',
        'submitted_at',
    ];
}
