<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratJalan extends Model
{
    public function items()
    {
        return $this->hasMany(SuratJalanDetail::class, 'surat_jalan_id', 'id');
    }

    public function creator() {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function driver() {
        return $this->belongsTo(User::class, "driver_id", "id");
    }
}
