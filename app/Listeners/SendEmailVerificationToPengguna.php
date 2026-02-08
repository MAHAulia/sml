<?php

namespace App\Listeners;

use App\Events\PenggunaRegistered;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendEmailVerificationToPengguna
{
    /**
     * @param  App\Events\PenggunaRegistered;  $event
     * @return void
     */
    public function handle(PenggunaRegistered $event): void
    {
        if ($event->user instanceof MustVerifyEmail && ! $event->user->hasVerifiedEmail()) {
            $user = $event->user;
            $raw_password = $event->raw_password;
            $user->notify(new EmailVerificationNotification($raw_password));
        }
    }
}
