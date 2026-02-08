<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function reponses() {
        return $this->hasMany(FormData::class, 'formulir_id', 'id');
    }
}
