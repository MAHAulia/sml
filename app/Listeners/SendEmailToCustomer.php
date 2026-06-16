<?php

namespace App\Listeners;

use App\Events\DeliveryOrderStart;
use App\Events\ItemBagged;
use App\Events\ManifestCreated;
use App\Events\ManifestReceived;
use App\Events\PickupSuccess;
use App\Events\TransactionDeliveryStatusUpdated;
use App\Models\Bag;
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
    public function handle(PickupSuccess | ManifestCreated | ManifestReceived | ItemBagged | DeliveryOrderStart | TransactionDeliveryStatusUpdated $event): void
    {
        if ($event instanceof PickupSuccess) {
            $transaction = $event->transaction;
            $customer = Customer::find($transaction->customer_id);

            $offering = Offering::find($transaction->offering_id);
            // Send email to customer
            $customer->notify(new SendEmail($offering, "Pickup Success", "Pickup has been successfully completed. with order Number " . $transaction->order_number));
        } elseif ($event instanceof ManifestCreated) {
            $manifest = $event->manifest;
            $items = $manifest->items;
            // Send Email To Customer
            foreach ($items as $item) {
                if ($manifest->type == 'local') {
                    $transaction = Transaction::find($item->item_id)->with('offering')->first();
                    $customer = Customer::find($transaction->customer_id);
                    // Send email to customer
                    $customer->notify(new SendEmail($transaction->offering, "Manifest Created", "A new manifest has been created with ID " . $manifest->code . ", for your order number " . $transaction->order_number));
                } elseif ($manifest->type == 'linehaul') {
                    $bag = Bag::where('id', $item->item_id)->with('items')->first();
                    foreach ($bag->items as $bagItem) {
                        $transaction = Transaction::find($bagItem->transaction_id)->with('offering')->first();
                        $customer = Customer::find($transaction->customer_id);
                        // Send email to customer
                        $customer->notify(new SendEmail($transaction->offering, "Manifest Created", "A new manifest has been created with ID " . $manifest->code . ", for your order number " . $transaction->order_number . " to " . $manifest->to . " from " . $manifest->from));
                    }
                } else {
                }
            }
        } elseif ($event instanceof ManifestReceived) {
            $manifest = $event->manifest;
            $items = $manifest->items;
            // Send Email To Customer
            foreach ($items as $item) {
                if ($manifest->type == 'local') {
                    $transaction = Transaction::find($item->item_id)->with('offering')->first();
                    $customer = Customer::find($transaction->customer_id);
                    // Send email to customer
                    $customer->notify(new SendEmail($transaction->offering, "Manifest Received", "Your manifest with ID " . $manifest->code . " has been received with status 'received' with " . $manifest->to . " Order number: " . $transaction->order_number));
                } elseif ($manifest->type == 'linehaul') {
                    $bags = Bag::find($item->item_id)->with('items')->first();
                    foreach ($bags->items as $bagItem) {
                        $transaction = Transaction::find($bagItem->transaction_id)->with('offering')->first();
                        $customer = Customer::find($transaction->customer_id);
                        // Send email to customer
                        $customer->notify(new SendEmail($transaction->offering, "Manifest Received", "Your manifest with ID " . $manifest->code . " has been received with status 'received' with " . $manifest->to . " Order number: " . $transaction->order_number . " on " . $manifest->office_to));
                    }
                } else {
                }
            }
        } elseif ($event instanceof ItemBagged) {
            $bag = $event->bag;
            $items = $bag->items;
            foreach ($items as $item) {
                $transaction = Transaction::find($item->transaction_id)->with('offering')->first();
                $customer = Customer::find($transaction->customer_id);
                // Send email to customer
                $customer->notify(new SendEmail($transaction->offering, "Item Bagged", "An item has been bagged with Code " . $bag->code . " for your order number " . $transaction->order_number));
            }
        } elseif ($event instanceof DeliveryOrderStart) {
            $do = $event->do;
            $items = $do->items;
            foreach ($items as $item) {
                $transaction = Transaction::find($item->transaction_id)->with('offering')->first();
                $customer = Customer::find($transaction->customer_id);
                // Send email to customer
                $customer->notify(new SendEmail($transaction->offering, "Item Bagged", "An item with Code " . $do->code . " for your order number " . $transaction->order_number . " is on delivery order"));
            }
        } elseif ($event instanceof TransactionDeliveryStatusUpdated) {
            $transaction = $event->transaction;
            $customer = Customer::find($transaction->customer_id);
            // Send email to customer
            $customer->notify(new SendEmail($transaction->offering, "Delivery Status", "Your item with code $transaction->order_number status is $transaction->delivery_status"));
        }
    }
}
