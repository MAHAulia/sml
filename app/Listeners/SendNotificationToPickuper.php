<?php

namespace App\Listeners;

use App\Events\ManifestCreated;
use App\Events\ManifestReceived;
use App\Events\PickuperAssigned;
use App\Models\Bag;
use App\Models\Customer;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\SendEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationToPickuper
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
    public function handle(PickuperAssigned | ManifestCreated | ManifestReceived $event): void
    {

        if ($event instanceof PickuperAssigned) {
            $offering = $event->offering;
            $pickuperId = $offering->pickuper_id;

            $pickuper = User::where("id", $pickuperId)->first();
            if ($pickuper) {
                $notification = new Notification();
                $notification->user_id = $pickuper->id;
                $notification->title = "Pickuper Assignment";
                $notification->message = "You have been assigned as the pickuper for the offering from " . $offering->senderName . ".";
                $notification->save();

                // Send notification to user
                $pickuper->notify(new SendEmail($offering, $notification->title, $notification->message));

                $customer = Customer::where("id", $offering->customer_id)->first();
                if ($customer) {
                    $title = "Pickuper Assignment";
                    $message = "Your order has been assigned to be picked up by " . $pickuper->name . ".";
                    $customer->notify(new SendEmail($offering, $title, $message));
                }
            }
        }

        if ($event instanceof ManifestCreated) {
            $manifest = $event->manifest;
            $items = $manifest->items;

            foreach ($items as $item) {
                if ($manifest->type == "local") {
                    $transaction = Transaction::where("id", $item->item_id)->with('offering')->first();
                    $notification = new Notification();
                    $notification->user_id = $transaction->pickuper_id;
                    $notification->title = "Manifest Created";
                    $notification->message = "A manifest has been created for the offering from " . $transaction->offering->senderName . ".";
                    $notification->save();
                } elseif ($manifest->type == "linehaul") {
                    $bags = Bag::where("id", $item->item_id)->with('items')->first();
                    foreach ($bags->items as $bagItem) {
                        $transaction = Transaction::where("id", $bagItem->transaction_id)->with('offering')->first();
                        $notification = new Notification();
                        $notification->user_id = $transaction->pickuper_id;
                        $notification->title = "Manifest Created";
                        $notification->message = "A manifest has been created for the offering from " . $transaction->offering->senderName . ".";
                        $notification->save();
                    }
                    
                } else {

                }
                
                
            }
            
        }

        if ($event instanceof ManifestReceived) {
            $manifest = $event->manifest;
            $items = $manifest->items;

            foreach ($items as $item) {
                $transaction = Transaction::where("id", $item->item_id)->with('offering')->first();
                $notification = new Notification();
                $notification->user_id = $transaction->pickuper_id;
                $notification->title = "Manifest Received";
                $notification->message = "A manifest has been received for the offering from " . $transaction->offering->senderName . ".";
                $notification->save();
            }
            
        }
    }
}
