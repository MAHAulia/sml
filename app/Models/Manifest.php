<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manifest extends Model
{
    public function items() {
        return $this->hasMany(ManifestDetail::class);
    }

    public function creator() {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function receiver() {
        return $this->belongsTo(User::class, "receiver_id", "id");
    }
}
