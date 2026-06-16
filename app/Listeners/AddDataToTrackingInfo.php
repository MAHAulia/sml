<?php

namespace App\Listeners;

use App\Events\DeliveryOrderStart;
use App\Events\ItemBagged;
use App\Events\ManifestCreated;
use App\Events\ManifestReceived;
use App\Events\OfferingSuccessFullyCreated;
use App\Events\PickupSuccess;
use App\Models\Bag;
use App\Models\TrackAndTrace;
use App\Models\Transaction;
use App\Models\User;
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
    public function handle(PickupSuccess | ManifestCreated | ManifestReceived | ItemBagged | DeliveryOrderStart $event): void
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

        if ($event instanceof ManifestCreated) {
            $manifest = $event->manifest;
            $items = $manifest->items;

            foreach ($items as $item) {
                if ($manifest->type == "local") {
                    $transaction = Transaction::where('id', $item->item_id)->with('offering')->first();
                    $trackAndTrace = new TrackAndTrace();
                    $trackAndTrace->offering_id = $transaction->offering->id;
                    $trackAndTrace->transaction_id = $transaction->id;
                    $trackAndTrace->tracking_number = $transaction->order_number;
                    $trackAndTrace->status = 'Manifest Created';
                    $trackAndTrace->location = $manifest->status == "send" ? $manifest->office_from : $manifest->office_to;
                    $trackAndTrace->description = 'Manifest has been successfully created.';
                    $trackAndTrace->save();
                }

                if ($manifest->type == "linehaul") {
                    $bag = Bag::where('id', $item->item_id)->with('items')->first();
                    foreach ($bag->items as $bagItem) {
                        $transaction = Transaction::where('id', $bagItem->transaction_id)->with('offering')->first();
                        $trackAndTrace = new TrackAndTrace();
                        $trackAndTrace->offering_id = $transaction->offering->id;
                        $trackAndTrace->transaction_id = $transaction->id;
                        $trackAndTrace->tracking_number = $transaction->order_number;
                        $trackAndTrace->status = 'Manifest Created';
                        $trackAndTrace->location = $manifest->status == "send" ? $manifest->office_from : $manifest->office_to;
                        $trackAndTrace->description = 'Manifest has been successfully created.';
                        $trackAndTrace->save();
                    }
                }
            }
        }

        if ($event instanceof ManifestReceived) {
            $manifest = $event->manifest;
            $items = $manifest->items;

            foreach ($items as $item) {
                if ($manifest->type == "local") {
                    $transaction = Transaction::where('id', $item->item_id)->with('offering')->first();
                    $trackAndTrace = new TrackAndTrace();
                    $trackAndTrace->offering_id = $transaction->offering->id;
                    $trackAndTrace->transaction_id = $transaction->id;
                    $trackAndTrace->tracking_number = $transaction->order_number;
                    $trackAndTrace->status = 'Manifest Received';
                    $trackAndTrace->location = $manifest->status == "send" ? $manifest->office_from : $manifest->office_to;
                    $trackAndTrace->description = 'Manifest has been successfully received on ' . $manifest->to . '.';
                    $trackAndTrace->save();
                }
                if ($manifest->type == "linehaul") {
                    $bag = Bag::where('id', $item->item_id)->with('items')->first();
                    foreach ($bag->items as $bagItem) {
                        $transaction = Transaction::where('id', $bagItem->transaction_id)->with('offering')->first();
                        $trackAndTrace = new TrackAndTrace();
                        $trackAndTrace->offering_id = $transaction->offering->id;
                        $trackAndTrace->transaction_id = $transaction->id;
                        $trackAndTrace->tracking_number = $transaction->order_number;
                        $trackAndTrace->status = 'Manifest Received';
                        $trackAndTrace->location = $manifest->status == "send" ? $manifest->office_from : $manifest->office_to;
                        $trackAndTrace->description = 'Manifest has been successfully received on ' . $manifest->to . '.';
                        $trackAndTrace->save();
                    }
                }
            }
        }

        if ($event instanceof ItemBagged) {
            $bag = $event->bag;
            $items = $bag->items;

            foreach ($items as $item) {
                $transaction = Transaction::where('id', $item->transaction_id)->with('offering')->first();
                $trackAndTrace = new TrackAndTrace();
                $trackAndTrace->offering_id = $transaction->offering->id;
                $trackAndTrace->transaction_id = $transaction->id;
                $trackAndTrace->tracking_number = $transaction->order_number;
                $trackAndTrace->status = 'Item Bagged';
                $trackAndTrace->location = $bag->status == "bagged" ? $bag->office : $bag->office_to;
                $trackAndTrace->description = 'Item has been successfully bagged.';
                $trackAndTrace->save();
            }
        }

        if ($event instanceof DeliveryOrderStart) {
            $do = $event->do;
            $items = $do->items;
            $userDO = User::where("id", $do->user_id)->first();

            foreach ($items as $item) {
                $transaction = Transaction::where('id', $item->transaction_id)->with('offering')->first();
                $trackAndTrace = new TrackAndTrace();
                $trackAndTrace->offering_id = $transaction->offering->id;
                $trackAndTrace->transaction_id = $transaction->id;
                $trackAndTrace->tracking_number = $transaction->order_number;
                $trackAndTrace->status = 'Item on delivery order';
                $trackAndTrace->location = $userDO->offiece;
                $trackAndTrace->description = 'Item has been added to delivery order.';
                $trackAndTrace->save();
            }
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
