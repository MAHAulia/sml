<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PenggunaRegistered
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     * @var \App\Models\User
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user  The authenticated user.
     */

    public $user, $raw_password;
    
    public function __construct(User $user, string $raw_password) {
        $this->user = $user;
        $this->raw_password = $raw_password;
    }
}
