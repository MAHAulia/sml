<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bag extends Model
{
    public function items() {
        return $this->hasMany(BagDetail::class);
    }
}
