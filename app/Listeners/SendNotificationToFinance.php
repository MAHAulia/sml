<?php

namespace App\Listeners;

use App\Events\RequestPriceReview;
use App\Models\Notification;
use App\Models\RoleUser;
use App\Notifications\OfferingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationToFinance
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
    public function handle(RequestPriceReview $event): void
    {
        $offering = $event->offering;
        $user = $event->user;
        $status = $event->status;

        $financeUsers = RoleUser::where('role_id', 7)->with('user')->get();

        foreach ($financeUsers as $roleUser) {
            if ($status == "request") {
                $title = "New Price Request";
                $message = "There is a new price request for offering from " . $offering->senderName;
            } else {
                $title = "Price Set";
                $message = "The price for offering from " . $offering->senderName . " has been set.";
            }
            // Add to notification
            $notification = new Notification();
            $notification->user_id = $roleUser->user_id;
            $notification->title = $title;
            $notification->message = $message;
            $notification->save();

            // Send notification to user
            $roleUser->user->notify(new OfferingCreated($offering, $notification->title, $notification->message));
        }
    }
}
