<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratJalanDetail extends Model
{
    protected $fillable = [
        'id',
        'surat_jalan_id',
        'manifest_id',
        'status'
    ];
}
