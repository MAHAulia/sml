<?php

namespace App\Listeners;

use App\Events\PickupSuccess;
use App\Models\Customer;
use App\Models\Offering;
use App\Notifications\SendEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendEmailToCustomer
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PickupSuccess $event): void
    {
        if ($event instanceof PickupSuccess) {
            $transaction = $event->transaction;
            $customer = Customer::find($transaction->customer_id);

            $offering = Offering::find($transaction->offering_id);
            // Send email to customer
            $customer->notify(new SendEmail($offering, "Pickup Success", "Pickup has been successfully completed. with order Number ". $transaction->order_number));

        }
    }
}
