<?php

declare(strict_types=1);

use Alxtexh\Panel\Widgets\ChartWidget;
use Alxtexh\Panel\Widgets\Period;
use Alxtexh\Panel\Tests\TestCase;

uses(TestCase::class);

it('caches chart data per tenant and period when explicitly invalidated', function (): void {
    $calls = 0;
    $chart = ChartWidget::make('revenue', 'Revenue')
        ->cache(60)
        ->invalidatedBy(['InvoicePosted'])
        ->data(function () use (&$calls): array {
            $calls++;

            return [['label' => 'Today', 'value' => 10]];
        });

    $chart->resolve(Period::Today, 'tenant-a');
    $chart->resolve(Period::Today, 'tenant-a');
    $chart->resolve(Period::Today, 'tenant-b');

    expect($calls)->toBe(2);
});

it('contains a chart cache configuration error in the widget response', function (): void {
    $result = ChartWidget::make('broken-cache', 'Broken cache')
        ->cache(60)
        ->data(static fn (): array => [['label' => 'Today', 'value' => 1]])
        ->resolve(Period::Today, 'tenant-a');

    expect($result['error'])->toBeTrue();
});
