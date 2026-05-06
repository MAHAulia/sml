<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryOrderDetail extends Model
{
    protected $fillable = [
        'delivery_order_id',
        'transaction_id',
        'status',
    ];

    public function deliveryOrder()
    {
        return $this->belongsTo(DeliveryOrder::class);
    }

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
