<?php

namespace App\Events;

use App\Models\Offering;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OfferingSuccessFullyCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $offering;
    public $title;
    public $message;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Offering  $offering
     * @param  \App\Models\User  $user
     * @param  string  $title
     * @param  string  $message
     */
    public function __construct(Offering $offering, User $user, string $title = "New Offering Created", string $message = "A new offering has been created.")
    {
        $this->offering = $offering;
        $this->user = $user;
        $this->title = $title;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
