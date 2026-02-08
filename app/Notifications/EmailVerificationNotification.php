<?php

namespace App\Notifications;

use App\Mail\PenggunaRegistered;
use App\Mail\SendVerificationEmail;
use App\Mail\VerifyEmail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Uri;

class EmailVerificationNotification extends Notification
{
    use Queueable;

    public $raw_password;
    /**
     * Create a new notification instance.
     */
    public function __construct(string $raw_password)
    {
        $this->raw_password = $raw_password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(User $user): MailMessage
    {
        $url = Uri::temporarySignedRoute(
            'pengguna.verify',
            now()->addMinutes(60),
            ['id' => $user->getKey(), 'hash' => sha1($user->getEmailForVerification())]
        );

        return (new MailMessage)
            ->greeting('Hello, ' . $user->name . ' 👋')
            ->line('Anda sekarang sudah terdaftar di aplikasi ' . config('app.name') . '.')
            ->line('Untuk dapat melanjutkan akses aplikasi, silahkan klik tombol di bawah ini untuk melakukan verifikasi akun Anda.')
            ->action('Verifikasi Akun', $url)
            ->line('Berikut adalah kredensial akun Anda:')
            ->line('')
            ->line('```')
            ->line('Email    : ' . $user->email)
            ->line('Password : ' . $this->raw_password)
            ->line('```')
            ->line('')
            ->line('Jika Anda tidak membuat akun ini, Anda tidak perlu melakukan apa pun.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
