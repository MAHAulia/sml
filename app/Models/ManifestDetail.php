<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManifestDetail extends Model
{
    protected $fillable = [
        'id',
        'item_id',
        'manifest_id',
        'status'
    ];
}
