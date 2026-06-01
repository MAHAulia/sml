<?php

namespace App\Listeners;

use App\Events\ManifestCreated;
use App\Events\ManifestReceived;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\SendEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationNoDelivery
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
    public function handle(ManifestReceived | ManifestCreated $event): void
    {
        if ($event instanceof ManifestCreated) {
            $manifest = $event->manifest;
            $items = $manifest->items;

            if ($manifest->to == "Delivery") {
                $userDelivery = User::whereHas('roles', function ($query) {
                    $query->where('name', 'Delivery');
                })
                ->where("office", $manifest->office_to)->get();

                foreach ($userDelivery as $user) {
                    $notification = new Notification();
                    $notification->user_id = $user->id;
                    $notification->title = "Manifest Created";
                    $notification->message = "A manifest with ID " . $manifest->code . " has been created with status 'created' with " . $manifest->to . " Order number: " . $manifest->items[0]->item_id . " on " . $manifest->office_to;
                    $notification->save();

                    // Send notification to user
                    $user->notify(new SendEmail(null, $notification->title, $notification->message));
                }
            }
           
        }

        if ($event instanceof ManifestReceived) {
            $manifest = $event->manifest;
            $items = $manifest->items;

            if ($manifest->to == "Delivery") {
                $userDelivery = User::whereHas('roles', function ($query) {
                    $query->where('name', 'Delivery');
                })
                ->where("office", $manifest->office_to)->get();

                foreach ($userDelivery as $user) {
                    $notification = new Notification();
                    $notification->user_id = $user->id;
                    $notification->title = "Manifest Received";
                    $notification->message = "A manifest with ID " . $manifest->code . " has been received with status 'received' with " . $manifest->to . " Order number: " . $manifest->items[0]->item_id . " on " . $manifest->office_to;
                    $notification->save();

                    // Send notification to user
                    $user->notify(new SendEmail(null, $notification->title, $notification->message));
                }
            }
           
        }
    }
}
