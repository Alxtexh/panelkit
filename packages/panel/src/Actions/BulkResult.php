<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

/**
 * Honest accounting for one bulk run.
 *
 * A collection-level authorization check can approve an operation while
 * individual-record checks still exclude some rows. Returning only `affected`
 * made that partial result indistinguishable from a complete success.
 */
final class BulkResult
{
    public function __construct(
        public readonly int $selected,
        public readonly int $authorized,
        public readonly int $affected,
        public readonly int $skipped,
    ) {}

    /** @return array<string, int> */
    public function toArray(): array
    {
        return [
            'selected' => $this->selected,
            'authorized' => $this->authorized,
            'affected' => $this->affected,
            'skipped' => $this->skipped,
            'done' => $this->affected,
        ];
    }
}
