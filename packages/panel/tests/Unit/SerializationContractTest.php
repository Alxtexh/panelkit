<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Tables\Columns\Column;
use Alxtexh\Panel\Tests\TestCase;
use ReflectionClass;

/**
 * The general, structural version of what `ColumnToArraySchemaTest` checks by
 * example. That test locks in four hand-picked columns (Money, Code, KeyValue,
 * Rating); this one walks every concrete `Column` subclass by reflection so a
 * FUTURE column with the same mistake fails a test instead of shipping silent.
 *
 * THE SHAPE THIS GUARDS AGAINST: `Column::toSchema(): array { return
 * $this->toArray(); }` is a plain, non-abstract alias kept only so a caller
 * that treats every schema node uniformly (`Renderable`) can call one method
 * name. `Table.php`'s actual column-serialisation loop always calls
 * `->toArray()` directly, twice, never `->toSchema()`. A subclass that
 * overrides `toSchema()` - to add its own fields - without ALSO overriding
 * `toArray()` compiles cleanly, reads as correct, and its override never
 * runs: the real pipeline calls the inherited `toArray()`, which knows
 * nothing about the fields the subclass thought it was adding. That is
 * exactly what happened to `MoneyColumn`, `CodeColumn`, `KeyValueColumn` and
 * `RatingColumn` before they were fixed to override `toArray()` instead.
 *
 * WHY THIS CHECK IS COLUMN-SPECIFIC. An audit of every other class hierarchy
 * with a `toSchema()`/`toArray()` pair in this codebase (Forms\Fields\Field,
 * Infolists\Entry, Schema\Component, Actions\Action, Tables\Filters\Filter,
 * the standalone Widgets, and the various `final` value objects - Group,
 * Summarizer, PageLayout, Workspace, Board, Lens, Transition, Workflow,
 * Comments, RelationManager) found none with this shape:
 *
 *   - Field, Entry and Component declare ONLY `toSchema()` on their abstract
 *     base - there is no `toArray()` anywhere in those hierarchies for a
 *     subclass to mistakenly override instead. Nothing to alias into.
 *   - Action declares ONLY `toArray()` - no `toSchema()` exists anywhere in
 *     the Actions family.
 *   - Filter declares `toArray()` as ABSTRACT (forcing every subclass to
 *     implement it - PHP will not compile otherwise) and a concrete
 *     `toSchema()` that is a genuinely different, intentionally lighter
 *     "structure only, for the cached schema" view (see its docblock) - not
 *     a delegating alias. A subclass overriding both is by design, not a bug.
 *   - The standalone Widgets (StatWidget, ChartWidget, TableWidget, ...) share
 *     no base class at all - each is `final`, so there is no hierarchy for
 *     an alias trap to live in.
 *   - Group, Summarizer, PageLayout, Workspace, Board, Lens, Transition,
 *     Workflow, Comments and RelationManager are all `final class` with only
 *     `toSchema()` defined - not extendable, so there is no subclass to get
 *     this wrong.
 *
 * `Column` is the only hierarchy where the base class defines BOTH methods
 * non-abstractly with one delegating to the other, which is the precondition
 * for this bug to exist at all. If a future refactor gives another hierarchy
 * that same shape, extend `alias_trap_hierarchies()` below to cover it.
 */
final class SerializationContractTest extends TestCase
{
    /**
     * Each entry is [base class, alias method, real method, directory to scan].
     * The alias method must be a plain, non-abstract delegating method on the
     * base class (`return $this->realMethod();`) for this check to apply - see
     * the class docblock for why only `Column` currently qualifies.
     *
     * @return list<array{0: class-string, 1: string, 2: string, 3: string}>
     */
    public static function alias_trap_hierarchies(): array
    {
        return [
            [Column::class, 'toSchema', 'toArray', __DIR__.'/../../src/Tables/Columns'],
        ];
    }

    public function test_no_concrete_subclass_overrides_the_alias_without_the_real_method(): void
    {
        $checked = 0;

        foreach (self::alias_trap_hierarchies() as [$baseClass, $aliasMethod, $realMethod, $directory]) {
            $subclasses = self::concreteSubclassesUnder($directory, $baseClass);

            // The audit that produced this test found several concrete
            // subclasses for `Column`; if the directory scan ever comes back
            // empty, the test is silently checking nothing, which is worse
            // than the bug it is meant to catch.
            self::assertNotEmpty($subclasses, "No concrete subclasses of {$baseClass} were found under {$directory} - the file scan may be broken.");

            foreach ($subclasses as $class) {
                $checked++;
                $reflection = new ReflectionClass($class);

                $declaresAlias = $reflection->hasMethod($aliasMethod)
                    && $reflection->getMethod($aliasMethod)->getDeclaringClass()->getName() === $class;

                $declaresReal = $reflection->hasMethod($realMethod)
                    && $reflection->getMethod($realMethod)->getDeclaringClass()->getName() === $class;

                self::assertFalse(
                    $declaresAlias && ! $declaresReal,
                    "{$class} overrides {$baseClass}::{$aliasMethod}() (a plain alias for {$realMethod}()) ".
                    "without also overriding {$realMethod}() itself. The real serialisation pipeline calls ".
                    "->{$realMethod}() directly, never ->{$aliasMethod}(), so whatever {$class}::{$aliasMethod}() ".
                    "adds will silently never reach the client. Rename the override to {$realMethod}() and call ".
                    "parent::{$realMethod}() - see MoneyColumn::toArray() for the pattern.",
                );
            }
        }

        self::assertGreaterThan(0, $checked, 'No classes were checked at all - alias_trap_hierarchies() may be empty or its directories wrong.');
    }

    /**
     * Every concrete (non-abstract) class in `$directory` that is-a `$baseClass`.
     *
     * File-scans rather than relying on autoload discovery, since Composer's
     * PSR-4 map has no "list every class under this namespace" operation.
     *
     * @param  class-string  $baseClass
     * @return list<class-string>
     */
    private static function concreteSubclassesUnder(string $directory, string $baseClass): array
    {
        $classes = [];

        foreach (glob(rtrim($directory, '/').'/*.php') ?: [] as $file) {
            $contents = file_get_contents($file);

            if ($contents === false || ! preg_match('/^namespace\s+([^;]+);/m', $contents, $namespaceMatch)) {
                continue;
            }

            if (! preg_match('/^(?:final\s+|abstract\s+)?class\s+(\w+)/m', $contents, $classMatch)) {
                continue;
            }

            $class = $namespaceMatch[1].'\\'.$classMatch[1];

            if (! class_exists($class)) {
                continue;
            }

            $reflection = new ReflectionClass($class);

            if ($reflection->isAbstract() || $reflection->isInterface()) {
                continue;
            }

            if ($class !== $baseClass && $reflection->isSubclassOf($baseClass)) {
                $classes[] = $class;
            }
        }

        sort($classes);

        return $classes;
    }
}
