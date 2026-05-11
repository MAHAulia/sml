<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        "id",
        "user_id",
        "customer_id",
        "no_invoice",
        "status",
        "reason",
        "nominal",
        "sending_date_time",
        "paid_at",
        "created_at",
        "updated_at",
    ];
    protected $appends = ['aging'];

    public function mitra() {
        return $this->belongsTo(Customer::class, "customer_id", "id");
    }

    public function getAgingAttribute()
    {
        if (!$this->sending_date_time) {
            return 0;
        }

        return Carbon::parse($this->sending_date_time)->diffInDays(now());
    }
}
