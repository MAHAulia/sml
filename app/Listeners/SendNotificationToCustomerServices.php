<?php

namespace App\Listeners;

use App\Events\OfferingSuccessFullyCreated;
use App\Models\Notification;
use App\Models\RoleUser;
use App\Models\User;
use App\Notifications\OfferingCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationToCustomerServices
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
    public function handle(OfferingSuccessFullyCreated $event): void
    {
        $offering = $event->offering;
        $user = $event->user;
        $title = $event->title;
        $message = $event->message;

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
    }
}
