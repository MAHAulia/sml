<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manifest extends Model
{
    public function items() {
        return $this->hasMany(ManifestDetail::class);
    }
}
