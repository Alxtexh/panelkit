# Production checklist

## Queues

Bulk actions past the queue threshold, exports, imports, and scheduled
reports all dispatch jobs. Without a worker running, they queue and never
run — the screen reports a job stuck pending, not an error.

```bash
php artisan queue:work --queue=default
```

## Live updates: poll or push, pick one per widget

```php
StatWidget::make('online', 'Online')
    ->live('dashboard.stats')  // pushed via Reverb/Echo, when window.Echo exists
    ->poll('10s');             // HTTP fallback otherwise
```

Declare both — the client skips the polling interval automatically whenever
a live channel is actually connected, so a stock install with no Reverb
still refreshes via polling. Never rely on `->live()` alone unless you're
certain every deployment has Reverb configured.

Any package-level live channel for lists must be **private and
tenant-scoped** (`'channel' => 'tenant.{tenant}.{resource}'`) — a public or
tenant-agnostic channel is a cross-tenant leak no server-side check can
catch after the fact, which is why the broadcast driver refuses to start
without one. Verify the socket after touching broadcasting configuration:

```bash
make verify-broadcast
```

Nothing else will surface a broken transport — the client silently degrades
to polling when `window.Echo` is absent, so a misconfigured push transport
still renders a working-looking panel.

## SSR

Off by default, deliberately — shipping it on with nothing serving it means
every request pays a failed connection before falling back, which is a
panel that works and is quietly slower than it should be. Turn it on only
once something is actually listening.

## Assets

```bash
npm run build
```

The published `resources/css/app.css` must point Tailwind at the package.
Without that, every utility class used only inside the package gets purged
— you get a correctly-structured table with no styling at all, which reads
as "the design didn't ship," not as a build error.

## Databases

If you developed against SQLite, every performance number you've seen so
far demonstrates that a query's *shape* is sound, not that it will hold on
Postgres/MySQL unchanged at scale. Benchmark on your production engine
before trusting a number from local development.

## Search at scale

`panel:doctor` nudges you toward `panel:search-index` once a searchable
table grows large enough that a plain `LIKE` scan stops being fast — see the
[command reference](/commands/).

## Backups

The Backups screen reads whatever `spatie/laravel-backup` is configured
with. Restore and delete require `manage_backups`, kept separate from
`view_operations` so an operator who can see operational data can't also
destroy a backup.

## Before you ship

```bash
php artisan panel:doctor
php artisan panel:permissions sync
php artisan panel:benchmark --runs=3
```

And run the **negative journey**, not just the positive one: sign in as
somebody from another organisation and walk the same pages a real customer
would. Every hop must fail. A positive journey passes just as happily with
no tenant isolation at all — a negative journey that also passes is the
finding that actually tells you something.
