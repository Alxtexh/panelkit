<?php

declare(strict_types=1);

use Alxtexh\Panel\Support\OperationStatus;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

it('records a normalized installation-wide operation envelope', function (): void {
    $status = app(OperationStatus::class);

    $status->record('test-operation', 'backup.manual', 'running', 'Starting', [
        'by' => 7,
        'progress' => 25,
    ]);

    $running = $status->get('test-operation');

    expect($running)
        ->operation->toBe('backup.manual')
        ->state->toBe('running')
        ->status->toBe('running')
        ->message->toBe('Starting')
        ->progress->toBe(25)
        ->startedAt->toBeString()
        ->finishedAt->toBeNull();

    $status->record('test-operation', 'backup.manual', 'succeeded', 'Completed.');

    $done = $status->get('test-operation');

    expect($done)
        ->status->toBe('done')
        ->failure->toBeNull()
        ->finishedAt->toBeString()
        ->by->toBe(7);
});

it('normalizes refused and cancelled states for consumers', function (): void {
    expect(OperationStatus::normalizeStatus('refused'))->toBe('failed')
        ->and(OperationStatus::normalizeStatus('cancelled'))->toBe('canceled')
        ->and(OperationStatus::normalizeStatus('skipped'))->toBe('skipped');
});
