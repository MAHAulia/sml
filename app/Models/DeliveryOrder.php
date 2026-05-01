<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    public function items() {
        return $this->hasMany(DeliveryOrderDetail::class, "delivery_order_id", "id");
    }
}
