<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Widgets;

use Closure;

/**
 * Dashboard barcode card. Draws via JsBarcode on the client (same as BarcodeField).
 *
 *     BarcodeWidget::make('sku', 'SKU')
 *         ->value(fn (): string => (string) Product::query()->value('sku'))
 *         ->format('CODE128');
 *
 * Or several codes:
 *
 *     BarcodeWidget::make('labels', 'Labels')
 *         ->barcodes(fn (): array => [
 *             ['value' => '5901234123457', 'format' => 'EAN13', 'label' => 'Case'],
 *         ]);
 */
final class BarcodeWidget
{
    private ChartWidget $chart;

    private string $format = 'CODE128';

    private int $height = 64;

    private int $width = 2;

    private bool $displayValue = true;

    /** @var Closure(): string|null */
    private ?Closure $value = null;

    /** @var Closure(): list<array{value: string, key?: string, format?: string, label?: string, height?: int, width?: int, displayValue?: bool}>|null */
    private ?Closure $barcodes = null;

    private function __construct(string $key, string $label)
    {
        $this->chart = ChartWidget::make($key, $label)->type('barcode')->icon('package');
    }

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    /** JsBarcode format name (CODE128, EAN13, EAN8, UPC, CODE39, …). */
    public function format(string $format): self
    {
        $this->format = strtoupper(trim($format));

        return $this;
    }

    public function height(int $pixels): self
    {
        $this->height = max(24, min(240, $pixels));

        return $this;
    }

    public function barWidth(int $pixels): self
    {
        $this->width = max(1, min(6, $pixels));

        return $this;
    }

    public function hideValue(bool $hide = true): self
    {
        $this->displayValue = ! $hide;

        return $this;
    }

    /** @param  Closure(): string  $value */
    public function value(Closure $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @param  Closure(): list<array{value: string, key?: string, format?: string, label?: string, height?: int, width?: int, displayValue?: bool}>  $barcodes
     */
    public function barcodes(Closure $barcodes): self
    {
        $this->barcodes = $barcodes;

        return $this;
    }

    public function description(string $description): self
    {
        $this->chart->description($description);

        return $this;
    }

    /** @param int|array<string, int> $span */
    public function span(int|array $span): self
    {
        $this->chart->span($span);

        return $this;
    }

    public function sort(int $sort): self
    {
        $this->chart->sort($sort);

        return $this;
    }

    public function ability(?string $ability): self
    {
        $this->chart->ability($ability);

        return $this;
    }

    public function poll(int|string|null $interval = 15): self
    {
        $this->chart->poll($interval);

        return $this;
    }

    public function live(?string $channel): self
    {
        $this->chart->live($channel);

        return $this;
    }

    public function toChartWidget(): ChartWidget
    {
        $format = $this->format;
        $height = $this->height;
        $width = $this->width;
        $displayValue = $this->displayValue;
        $value = $this->value;
        $barcodes = $this->barcodes;

        return $this->chart->data(static function () use ($format, $height, $width, $displayValue, $value, $barcodes): array {
            if ($barcodes !== null) {
                $rows = array_map(static function (array $row) use ($format, $height, $width, $displayValue): array {
                    $payload = trim($row['value']);

                    return [
                        'key' => $row['key'] ?? $payload,
                        'value' => $payload,
                        'label' => $row['label'] ?? null,
                        'format' => strtoupper((string) ($row['format'] ?? $format)),
                        'height' => (int) ($row['height'] ?? $height),
                        'width' => (int) ($row['width'] ?? $width),
                        'displayValue' => array_key_exists('displayValue', $row)
                            ? (bool) $row['displayValue']
                            : $displayValue,
                    ];
                }, $barcodes());

                return ['barcodes' => $rows];
            }

            $payload = $value !== null ? trim((string) $value()) : '';

            return [
                'barcodes' => $payload === '' ? [] : [[
                    'key' => 'primary',
                    'value' => $payload,
                    'label' => null,
                    'format' => $format,
                    'height' => $height,
                    'width' => $width,
                    'displayValue' => $displayValue,
                ]],
            ];
        });
    }
}
