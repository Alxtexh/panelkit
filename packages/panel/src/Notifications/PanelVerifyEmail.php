<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Notifications;

use Alxtexh\Panel\Panel;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

/**
 * Verification mail that names THIS panel's route.
 *
 * Laravel's own notification hard-codes `verification.verify`. A generated
 * portal registers `{id}.verification.verify` under its prefix, so the stock
 * mail would 404 or hit somebody else's door.
 */
final class PanelVerifyEmail extends VerifyEmail
{
    public function __construct(private readonly Panel $panel) {}

    protected function verificationUrl($notifiable): string
    {
        if (! is_object($notifiable)) {
            throw new \InvalidArgumentException('The verification recipient must be an object.');
        }

        $email = method_exists($notifiable, 'getEmailForVerification')
            ? (string) $notifiable->getEmailForVerification()
            : (string) data_get($notifiable, 'email', '');

        return URL::temporarySignedRoute(
            $this->panel->getRouteName().'verification.verify',
            Carbon::now()->addMinutes((int) Config::get('auth.verification.expire', 60)),
            [
                'id' => method_exists($notifiable, 'getKey') ? $notifiable->getKey() : '',
                'hash' => sha1($email),
            ],
        );
    }
}
