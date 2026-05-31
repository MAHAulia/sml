<?php

namespace App\Listeners;

use App\Events\ManifestCreated;
use App\Events\PickupSuccess;
use App\Models\Customer;
use App\Models\Notification;
use App\Models\Offering;
use App\Models\Transaction;
use App\Models\User;
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
    public function handle(PickupSuccess | ManifestCreated $event): void
    {
        if ($event instanceof PickupSuccess) {
            $transaction = $event->transaction;
            $customer = Customer::find($transaction->customer_id);

            $offering = Offering::find($transaction->offering_id);
            // Send email to customer
            $customer->notify(new SendEmail($offering, "Pickup Success", "Pickup has been successfully completed. with order Number ". $transaction->order_number));

        } elseif ($event instanceof ManifestCreated) {
            $manifest = $event->manifest;
            $items = $manifest->items;
            // Send Email To Customer
            foreach ($items as $item) {
                if ($manifest->type == 'local') {
                    $transaction = Transaction::find($item->item_id)->with('offering')->first();
                    $customer = Customer::find($transaction->customer_id);
                    // Send email to customer
                    $customer->notify(new SendEmail($transaction->offering, "Manifest Created", "A new manifest has been created with ID ". $manifest->code . ", for your order number ". $transaction->order_number));
                } elseif ($manifest->type == 'local') {
                    // $offering = Offering::find($item->item_id);
                    // $transaction = Transaction::where("offering_id", $offering->id)->first();
                    // $customer = Customer::find($offering->customer_id);
                    // // Send email to customer
                    // $customer->notify(new SendEmail($offering, "Manifest Created", "A new manifest has been created with ID ". $manifest->code . ", for your order number ". $transaction->order_number));
                } else {

                }
            }

            
        }
    }
}
