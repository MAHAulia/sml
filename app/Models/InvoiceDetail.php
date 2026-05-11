<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    protected $fillable = [
        "id",
        "user_id",
        "customer_id",
        "invoice_id",
        "transaction_id"
    ];
}
