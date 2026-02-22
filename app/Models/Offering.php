<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offering extends Model
{
    protected $fillable = [
        "user_id",
        "customer_id",
        "biaya_id",
        "senderName",
        "senderPhone",
        "senderAddress",
        "receiverName",
        "receiverPhone",
        "receiverAddress",
        "total_item",
        "p",
        "l",
        "t",
        "weight",
        "isiKiriman",
        "catatan",
        "status"
    ];

    protected function casts(): array
    {
        return [
            
        ];
    }

    public function biaya()
    {
        return $this->belongsTo(Biaya::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
