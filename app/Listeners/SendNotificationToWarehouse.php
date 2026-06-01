<?php

namespace App\Listeners;

use App\Events\ItemBagged;
use App\Events\ManifestCreated;
use App\Models\Notification;
use App\Models\User;
use App\Notifications\SendEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendNotificationToWarehouse
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
    public function handle(ManifestCreated | ItemBagged $event): void
    {
        if ($event instanceof ManifestCreated) {
            $manifest = $event->manifest;
            
            if ($manifest->to == "Warehouse") {
                $warehouseUser = User::whereHas("roles", function ($query) {
                    $query->where("name", "warehouse");
                })
                ->where('office', $manifest->office_to)
                ->get();
                foreach ($warehouseUser as $warehouseUser) {
                    $warehouseUser->notify(new SendEmail(null, "Manifest Created", "A new manifest has been created with ID ". $manifest->code));  
                        
                    $notification = new Notification();
                    $notification->user_id = $warehouseUser->id;
                    $notification->title = 'Manifest Created';
                    $notification->message = "A new manifest has been created with ID ". $manifest->code;
                    $notification->save();
                }
            }
        }

        if ($event instanceof ItemBagged) {
            $bag = $event->bag;
            $warehouseUser = User::where("id", $bag->user_id)->first();

            $warehouseUser->notify(new SendEmail(null, "Item Bagged", "An item has been bagged with Code ". $bag->code));  
                
            $notification = new Notification();
            $notification->user_id = $warehouseUser->id;
            $notification->title = 'Item Bagged';
            $notification->message = "An item has been bagged with Code ". $bag->code;
            $notification->save();
        }
    }
}
