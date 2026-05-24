<?php

namespace App\Listeners;

use App\Events\TarifSet;
use App\Models\Notification;
use App\Models\RoleUser;
use App\Models\User;
use App\Notifications\OfferingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationToMarketing
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
    public function handle(TarifSet $event): void
    {
        $offering = $event->offering;
        $user = $event->user;
        $status = $event->status;

        if ($status == "on_nego") {
            $title = "Price Set on Nego";
            $message = "The price for offering from " . $offering->senderName . " has been set on nego.";
            $customerServiceUsers = RoleUser::where('role_id', 3)->with('user')->get();

            foreach ($customerServiceUsers as $roleUser) {
                // Add to notification
                $notification = new Notification();
                $notification->user_id = $roleUser->user_id;
                $notification->title = $title;
                $notification->message = $message;
                $notification->save();

                // Send notification to user
                $roleUser->user->notify(new OfferingCreated($offering, $title, $message));
            }
        } else if (in_array($status, ["accepted", "rejected"])) {
            $title = "Price " . ucfirst($status);
            $message = "The price for offering from " . $offering->senderName . " has been " . $status . ".";
            // Add to notification
            $notification = new Notification();
            $notification->user_id = $offering->user_id;
            $notification->title = $title;
            $notification->message = $message;
            $notification->save();

            // Send notification to user
            $userToNotify = User::find($offering->user_id);
            $userToNotify->notify(new OfferingCreated($offering, $title, $message));

            if ($status == "accepted") {
                $customerServiceUsers = RoleUser::where('role_id', 4)->with('user')->get();

                foreach ($customerServiceUsers as $csUser) {
                    // Add to notification
                    $notification = new Notification();
                    $notification->user_id = $csUser->user_id;
                    $notification->title = "Price Accepted";
                    $notification->message = "The price for offering for " . $offering->senderName . " has been accepted, please assign pickuper to pickup package..";
                    $notification->save();

                    // Send notification to user
                    $csUser->user->notify(new OfferingCreated($offering, $notification->title, $notification->message));
                }
            }
        } else {
            $title = "Price Set";
            $message = "The price for offering from " . $offering->senderName . " has been set.";
            $userId = $offering->user_id;
            // Add to notification
            $notification = new Notification();
            $notification->user_id = $userId;
            $notification->title = $title;
            $notification->message = $message;
            $notification->save();

            // Send notification to user
            $userToNotify = User::find($userId);
            $userToNotify->notify(new OfferingCreated($offering, $notification->title, $notification->message));
        }
    }
}
