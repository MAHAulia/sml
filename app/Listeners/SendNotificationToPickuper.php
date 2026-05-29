<?php

namespace App\Listeners;

use App\Events\PickuperAssigned;
use App\Models\Customer;
use App\Models\Notification;
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
    public function handle(PickuperAssigned $event): void
    {
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
}
