<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BagDetail extends Model
{
    protected $fillable = [
        'id',
        'bag_id',
        'transaction_id',
    ];

    public function item() {
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id');
    }
}
