<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratJalanHistory extends Model
{
    protected $fillable = [
        'surat_jalan_id',
        'user_id',
        'status',
        'nopol',
        'mobil_id',
        'driver_id'
    ];
}
