<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mobil extends Model
{
    protected $fillable = [
        'nopol',
        'merek',
        'description'
    ];
    
    public function sopir() {
        return $this->hasOne(User::class);
    }
}
