<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratJalan extends Model
{
    public function items()
    {
        return $this->hasMany(SuratJalanDetail::class, 'surat_jalan_id', 'id');
    }
}
