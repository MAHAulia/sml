<?php

namespace App\Listeners;

use App\Events\SuratJalanCreated;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\SendEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationToDriver
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
    public function handle(SuratJalanCreated $event): void
    {
        $suratJalan = $event->suratJalan;
        $user = $event->user;
        $status = $event->status;

        $title = "Surat Jalan Created";
        $message = "A new surat jalan has been created.";
        $userId = $user->id;
        // Add to notification
        $notification = new Notification();
        $notification->user_id = $userId;
        $notification->title = $title;
        $notification->message = $message;
        $notification->save();

        // Send notification to user
        $userToNotify = User::find($userId);
        $userToNotify->notify(new SendEmail(null, $notification->title, $notification->message));

        // Send notification to driver
        $driverId = $suratJalan->driver_id;
        $driver = User::find($driverId);
        if ($driver) {
            // Add to notification
            $notification = new Notification();
            $notification->user_id = $driverId;
            $notification->title = $title;
            $notification->message = $message . ", please check your surat jalan details.";
            $notification->save();

            $driver->notify(new SendEmail(null, $notification->title, $notification->message));
        }
    }
}
