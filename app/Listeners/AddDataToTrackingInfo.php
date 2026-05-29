<?php

namespace App\Listeners;

use App\Events\OfferingSuccessFullyCreated;
use App\Events\PickupSuccess;
use App\Models\TrackAndTrace;
use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AddDataToTrackingInfo
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
    public function handle(object $event): void
    {
        if ($event instanceof PickupSuccess) {
            $transaction = $event->transaction;

            $trackAndTrace = new TrackAndTrace();
            $trackAndTrace->offering_id = $transaction->offering_id;
            $trackAndTrace->transaction_id = $transaction ? $transaction->id : null;
            $trackAndTrace->tracking_number = $transaction ? $transaction->order_number : null;
            $trackAndTrace->status = 'Pickup Success';
            $trackAndTrace->location = $transaction->receiverAddress;
            $trackAndTrace->description = 'Pickup has been successfully completed.';
            $trackAndTrace->save();
        }
        
        // $offering = $event->offering;
        // $user = $event->user;
        // $title = $event->title;
        // $message = $event->message;

        // $transaction = Transaction::where('offering_id', $offering->id)->first();

        // $trackAndTrace = new TrackAndTrace();
        // $trackAndTrace->offering_id = $event->offering->id;
        // $trackAndTrace->transaction_id = $transaction ? $transaction->id : null;
        // $trackAndTrace->tracking_number = $transaction ? $transaction->order_number : null;
        // $trackAndTrace->status = $title;;
        // $trackAndTrace->location = $user->office;
        // $trackAndTrace->description = $message;
        // $trackAndTrace->save();
    }
}
