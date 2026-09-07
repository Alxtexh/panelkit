<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Alxtexh\Panel\Auth\Turnstile;
use Alxtexh\Panel\Support\TenantContext;

/**
 * Post-install setup checklist for operators.
 *
 * Runs the same doctor-backed checks the dashboard SetupChecklist uses, scoped
 * to the items most hosts configure after `panel:install`.
 */
final class SetupCommand extends Command
{
    protected $signature = 'panel:setup {--json : Emit machine-readable output}';

    protected $description = 'Print a post-install setup checklist (mail, MFA, tenancy, Turnstile)';

    public function handle(TenantContext $context): int
    {
        $items = [
            $this->mailItem(),
            $this->mfaItem(),
            $this->tenancyItem($context),
            $this->turnstileItem(),
            ...$this->doctorItems(),
        ];

        if ((bool) $this->option('json')) {
            $this->line(json_encode($items, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT));

            return self::SUCCESS;
        }

        $this->components->info('Panel setup checklist');
        $this->newLine();

        foreach ($items as $item) {
            $mark = $item['done'] ? '<fg=green>✓</>' : '<fg=yellow>○</>';
            $this->line(" {$mark} {$item['title']}");

            if (! $item['done'] && $item['detail'] !== '') {
                $this->line("    {$item['detail']}");
            }
        }

        $open = array_values(array_filter($items, static fn (array $i): bool => ! $i['done']));

        $this->newLine();

        if ($open === []) {
            $this->components->info('All setup items look good.');
        } else {
            $this->line(count($open).' item(s) still need attention. Run `php artisan panel:doctor` for the full report.');
        }

        return self::SUCCESS;
    }

    /** @return array{key: string, title: string, detail: string, done: bool} */
    private function mailItem(): array
    {
        $default = config('mail.default');
        $from = (string) config('mail.from.address', '');
        $done = is_string($default) && $default !== ''
            && is_array(config('mail.mailers'))
            && $from !== '';

        return [
            'key' => 'mail',
            'title' => 'Mail delivery configured',
            'detail' => $done
                ? ''
                : 'Set MAIL_MAILER, MAIL_FROM_ADDRESS, and related mailer settings in .env.',
            'done' => $done,
        ];
    }

    /** @return array{key: string, title: string, detail: string, done: bool} */
    private function mfaItem(): array
    {
        $appKey = (string) config('app.key', '');
        $done = $appKey !== '' && $appKey !== 'base64:';

        return [
            'key' => 'mfa',
            'title' => 'Application key present (required for MFA and encryption)',
            'detail' => $done
                ? ''
                : 'Run `php artisan key:generate`. Passkeys also need `php artisan panel:install --auth` or your own passkey migration.',
            'done' => $done,
        ];
    }

    /** @return array{key: string, title: string, detail: string, done: bool} */
    private function tenancyItem(TenantContext $context): array
    {
        $mode = (string) config('panel.tenancy.mode', 'none');
        $done = $mode === 'none' || $context->mode() !== 'none';

        return [
            'key' => 'tenancy',
            'title' => $mode === 'none'
                ? 'Tenancy off (single-tenant install)'
                : 'Tenancy configured',
            'detail' => $done
                ? ''
                : 'Set panel.tenancy.mode and the tenant column, then verify Spatie permission teams if you use roles per tenant.',
            'done' => $done,
        ];
    }

    /** @return array{key: string, title: string, detail: string, done: bool} */
    private function turnstileItem(): array
    {
        $configured = Turnstile::configured();
        $enabled = Turnstile::enabled();

        return [
            'key' => 'turnstile',
            'title' => $enabled
                ? 'Turnstile enabled'
                : ($configured ? 'Turnstile keys present (currently off)' : 'Turnstile optional (not configured)'),
            'detail' => $configured || ! $enabled
                ? ''
                : 'Set TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY when you want login challenges.',
            'done' => ! $enabled || $configured,
        ];
    }

    /** @return list<array{key: string, title: string, detail: string, done: bool}> */
    private function doctorItems(): array
    {
        try {
            Artisan::call('panel:doctor', ['--json' => true]);
            $decoded = json_decode(Artisan::output(), true);
            $findings = is_array($decoded) ? $decoded : [];
        } catch (\Throwable $e) {
            return [[
                'key' => 'doctor',
                'title' => 'Could not run panel:doctor',
                'detail' => $e->getMessage(),
                'done' => false,
            ]];
        }

        $items = [];

        foreach ($findings as $finding) {
            if (! is_array($finding) || ($finding['level'] ?? null) !== 'problem') {
                continue;
            }

            $title = trim((string) ($finding['title'] ?? ''));

            if ($title === '') {
                continue;
            }

            $key = substr(hash('xxh128', $title), 0, 16);

            $items[] = [
                'key' => 'doctor:'.$key,
                'title' => $title,
                'detail' => trim((string) ($finding['detail'] ?? '')),
                'done' => false,
            ];
        }

        return $items;
    }
}
