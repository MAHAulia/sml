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

    public function manifest()
    {
        return $this->belongsTo(Manifest::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'item_id');
    }

    public function bag()
    {
        return $this->belongsTo(Bag::class, 'item_id');
    }

    public function getItemAttribute()
    {
        return $this->manifest?->type === 'local'
            ? $this->transaction
            : $this->bag;
    }
}
