<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Biaya extends Model
{
    protected $fillable = [
        "offering_id",
        "transaction_id",
        "user_id",
        "base_price",
        "offering_price",
        "deal_price",
        "nego_price",
        "status",
    ];
}
