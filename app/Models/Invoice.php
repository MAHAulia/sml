<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    public function mitra() {
        return $this->belongsTo(Customer::class, "customer_id", "id");
    }
}
