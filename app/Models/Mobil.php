<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mobil extends Model
{
    public function sopir() {
        return $this->hasOne(User::class);
    }
}
