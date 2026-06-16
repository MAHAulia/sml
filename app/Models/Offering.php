<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offering extends Model
{

    use HasFactory;

    protected $fillable = [
        "user_id",
        "customer_id",
        "biaya_id",
        "pickuper_id",
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
        "status",
        "pickup_status",
        "office"
    ];

    protected function casts(): array
    {
        return [];
    }

    public function biaya()
    {
        return $this->hasOne(Biaya::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function trackAndTraces()
    {
        return $this->hasMany(TrackAndTrace::class, 'offering_id');
    }
}
