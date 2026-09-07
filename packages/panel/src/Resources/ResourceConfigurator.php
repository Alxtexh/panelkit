<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Resources;

use InvalidArgumentException;

/**
 * Per-resource presentation choices: dedicated pages or modals for CRUD.
 *
 * DEFAULT IS PAGE everywhere, so existing resources keep linkable create, edit
 * and view screens until they opt into a modal for one operation.
 */
final class ResourceConfigurator
{
    public const MODE_PAGE = 'page';

    public const MODE_MODAL = 'modal';

    /** @var array<class-string, array<string, string>> */
    private static array $forms = [];

    /** @var array<class-string, list<class-string|Lens>> */
    private static array $lenses = [];

    /** @param class-string $resourceClass */
    public function __construct(private readonly string $resourceClass) {}

    /** @param class-string $resourceClass */
    public static function for(string $resourceClass): self
    {
        return new self($resourceClass);
    }

    public function createUsing(string $mode): self
    {
        $this->setFormMode('create', $mode);

        return $this;
    }

    public function editUsing(string $mode): self
    {
        $this->setFormMode('edit', $mode);

        return $this;
    }

    public function viewUsing(string $mode): self
    {
        $this->setFormMode('view', $mode);

        return $this;
    }

    /**
     * Nova-style alternate index views over the same resource.
     *
     * @param  list<class-string|Lens>  $lenses
     */
    public function lenses(array $lenses): self
    {
        self::$lenses[$this->resourceClass] = $lenses;

        return $this;
    }

    /** @return array{create: string, edit: string, view: string} */
    public static function formsFor(string $resourceClass, string $panelDefault = self::MODE_PAGE): array
    {
        $configured = self::$forms[$resourceClass] ?? [];

        return [
            'create' => self::normalizeMode($configured['create'] ?? $panelDefault),
            'edit' => self::normalizeMode($configured['edit'] ?? $panelDefault),
            'view' => self::normalizeMode($configured['view'] ?? $panelDefault),
        ];
    }

    /** @return list<Lens> */
    public static function resolvedLenses(string $resourceClass): array
    {
        if (! method_exists($resourceClass, 'lenses')) {
            return [];
        }

        $declared = $resourceClass::lenses();

        if ($declared === [] && isset(self::$lenses[$resourceClass])) {
            $declared = self::$lenses[$resourceClass];
        }

        $lenses = [];

        foreach ($declared as $lens) {
            if ($lens instanceof Lens) {
                $lenses[] = $lens;
                continue;
            }

            if (! class_exists($lens)) {
                throw new InvalidArgumentException("Lens class [{$lens}] does not exist.");
            }

            $lenses[] = self::normalizeLens($lens);
        }

        return $lenses;
    }

    public static function findLens(string $resourceClass, ?string $key): ?Lens
    {
        if ($key === null || $key === '') {
            return null;
        }

        foreach (self::resolvedLenses($resourceClass) as $lens) {
            if ($lens->key === $key) {
                return $lens;
            }
        }

        return null;
    }

    /** @internal */
    public static function flush(): void
    {
        self::$forms = [];
        self::$lenses = [];
    }

    /** @param class-string|Lens $lens */
    private static function normalizeLens(string|Lens $lens): Lens
    {
        if ($lens instanceof Lens) {
            return $lens;
        }

        if (method_exists($lens, 'lens')) {
            /** @var Lens $resolved */
            $resolved = $lens::lens();

            return $resolved;
        }

        throw new InvalidArgumentException(
            "Lens class [{$lens}] must be a Lens instance or declare a static lens() method.",
        );
    }

    private function setFormMode(string $action, string $mode): void
    {
        self::$forms[$this->resourceClass][$action] = self::normalizeMode($mode);
    }

    private static function normalizeMode(string $mode): string
    {
        if (! in_array($mode, [self::MODE_PAGE, self::MODE_MODAL], true)) {
            throw new InvalidArgumentException(
                "[{$mode}] is not a resource form mode. Use 'page' or 'modal'.",
            );
        }

        return $mode;
    }
}
