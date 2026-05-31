<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        "order_number",
        "offering_id",
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
        "pickup_status"
    ];

    // protected function casts(): array
    // {
    //     return [

    //     ];
    // }

    public function biaya()
    {
        return $this->hasOne(Biaya::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function manifestDetail()
    {
        return $this->hasOne(ManifestDetail::class, "item_id");
    }

    public function invoiceDetails()
    {
        return $this->hasMany(InvoiceDetail::class, 'transaction_id');
    }

    public function offering()
    {
        return $this->belongsTo(Offering::class);
    }
}
