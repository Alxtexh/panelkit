<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Resources;

use Alxtexh\Panel\Actions\Action;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Comments\Comments;
use Alxtexh\Panel\CustomFields\CustomField;
use Alxtexh\Panel\CustomFields\CustomFieldFactory;
use Alxtexh\Panel\Forms\Fields\Field;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Http\NestedContext;
use Alxtexh\Panel\Http\NestedRelation;
use Alxtexh\Panel\Infolists\Entry;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Schema\Component;
use Alxtexh\Panel\Schema\Renderable;
use Alxtexh\Panel\Support\Abilities;
use Alxtexh\Panel\Support\SchemaCache;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Tables\Columns\Column;
use Alxtexh\Panel\Tables\Columns\InlineWritableColumn;
use Alxtexh\Panel\Tables\ListResult;
use Alxtexh\Panel\Tables\Table;
use Illuminate\Contracts\Database\Query\Expression as QueryExpression;
use Alxtexh\Panel\Widgets\ChartWidget;
use Alxtexh\Panel\Widgets\StatWidget;
use Alxtexh\Panel\Widgets\TableWidget;
use Alxtexh\Panel\Workflow\Workflow;
use Alxtexh\Panel\Workflow\WorkflowOverride;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Expression;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use PhpOffice\PhpSpreadsheet\IOFactory;

/**
 * A panel resource. One subclass per screen, and no Vue at all.
 *
 * Everything a list screen needs splits into two halves that travel at
 * different rates and must never be mixed:
 *
 *   schema()   structure. Identical for every tenant, cached, sent once.
 *   data()     rows, filter options, counts. Sent on every interaction.
 *
 * `definition()` must not execute a query. It is called to build the schema,
 * which happens on a cache miss during an ordinary page render, and a query in
 * there is what antipatterns §3.3 describes: three eager option lookups in
 * action definitions took `/admin/clients` down for every tenant when a column
 * was missing, because definitions evaluate at render time rather than when the
 * control is opened. A test asserts zero queries during schema construction.
 */
abstract class Resource
{
    /** @var class-string<Model> */
    protected static string $model;

    protected static string $icon = 'list';

    /**
     * One sentence: what this list is for. Shown under the title on the
     * index page - see roadmap 3.9. No default, deliberately: a fallback
     * like "Manage your {label}" is true of every resource and tells the
     * operator nothing a generic list screen didn't already say. A resource
     * that ships without one fails `ListPageConventionsTest`, the same way
     * an unreachable screen fails the navigation coverage test.
     */
    protected static ?string $purpose = null;

    protected static ?string $group = null;

    /**
     * The cluster this resource belongs to, if any - a `Cluster` class-string.
     *
     * A NAVIGATION FACT ONLY, like `$group` and `showsInNavigation()`: the
     * routes, the policy and the schema are untouched. Members leave the
     * sidebar in favour of the cluster's single entry, and every member's
     * list page gains a sub-navigation to its siblings. See `Cluster`.
     *
     * @var class-string<Cluster>|null
     */
    protected static ?string $cluster = null;

    /**
     * The resource this one nests under, if any - roadmap 4.2.
     *
     * UNLIKE `$cluster`, THIS ONE CHANGES ROUTING AND AUTHORISATION. A nested
     * resource answers only under its parent's URL - `/clients/5/sessions` -
     * and never flat: `/sessions` does not route at all, because the parent
     * segment IS the authorisation context. Every request first resolves the
     * parent record through the parent resource's own model (tenant scopes
     * and all), checks `view` on it, and then constrains everything below to
     * rows whose foreign key points at that record. Creation stamps the key
     * from the URL, never from the form body.
     *
     * @var class-string<\Alxtexh\Panel\Resources\Resource>|null
     */
    protected static ?string $parent = null;

    /**
     * The column pointing back at the parent. Defaults to the parent's
     * singular key snake-cased with `_id`: `clients` gives `client_id`.
     */
    protected static ?string $parentColumn = null;

    /**
     * Parent-model method name for a BelongsToMany nested resource.
     *
     * HasMany uses `$parentColumn`. BelongsToMany sets this to the relation
     * method (`tags`) and answers at the same nested URLs, plus `/attach`.
     * Detach is a row action on the nested index. Dedicated pages, not modals.
     */
    protected static ?string $relationship = null;

    protected static ?int $sort = null;

    /**
     * Which panel this resource belongs to.
     *
     * DEFAULTS TO THE TENANT ADMIN, because that is what almost every resource
     * is and because the default has to be the SAFE one. A resource that forgets
     * to declare a panel lands in a tenant-scoped panel, where the worst outcome
     * is that it appears in the wrong navigation. Defaulting to a central panel
     * would mean a forgotten declaration silently disables tenant scoping.
     */
    protected static string $panel = 'admin';

    /**
     * Product module this resource belongs to, or null for always-on.
     *
     * Same gate as `Page::$module`: `isAccessible()` requires the key, the
     * sidebar omits it, and every resource URL answers 403. Core ISP screens
     * should leave this null unless the plan catalogue grants them.
     */
    protected static ?string $module = null;

    /**
     * WHERE IT WAS REGISTERED BEATS WHAT IT DECLARES, and that order matters
     * for anything a plugin installs.
     *
     * A plugin cannot know what an installation called its portals, so its
     * resource classes leave `$panel` at the default and the manager records
     * the panel each registration happened FOR. Reading the declaration here
     * meant a plugin's resource reported `admin` no matter where it was
     * actually mounted - which fed the schema cache the wrong key and, once
     * routes learned to carry their panel's path, produced a screen whose own
     * links pointed at a portal it does not live in.
     */
    public static function panel(): string
    {
        return app(PanelManager::class)->panelFor(static::class) ?? static::$panel;
    }

    /**
     * This resource's own URL, carrying the panel's path.
     *
     * THE ONE PLACE A RESOURCE'S URL IS SPELT, so a link written in a
     * resource class is correct in whichever portal it is mounted in. Writing
     * `'/tickets/'.$id` by hand is right in exactly one panel - the one at the
     * root - and that is how the second portal ended up with a list whose
     * every link left it.
     *
     * Resolved from where the resource was REGISTERED, not what it declares,
     * which is what makes it right for a plugin's classes too - see `panel()`.
     */
    public static function baseUrl(string $suffix = ''): string
    {
        $path = trim(app(PanelManager::class)->panel(static::panel())?->getPath() ?? '', '/');

        $prefix = $path === '' ? '' : '/'.$path;

        return $prefix.'/'.static::key().($suffix === '' ? '' : '/'.ltrim($suffix, '/'));
    }

    /**
     * What this resource's screens may cost, in milliseconds - roadmap 7.6.
     *
     * NULL MEANS THE COMMAND'S DEFAULT, which is right for almost every
     * resource: a generated list has one query shape, so one number describes
     * them all. Override it where a screen is legitimately dearer - a table
     * over a joined view, a summary that aggregates - and put the reason next
     * to it, because a budget with no reasoning is a number the next person
     * raises rather than investigates.
     *
     * RAISE IT DELIBERATELY OR NOT AT ALL. A budget that is never breached is
     * not a budget, and the moment to decide whether a screen is allowed to
     * cost more is the diff that made it cost more.
     */
    public static function budgetMs(): ?int
    {
        return null;
    }

    /** Declarative definition. MUST NOT query. */
    abstract public static function table(Table $table): Table;

    /**
     * Optional workflow on a status column. Off by default.
     *
     * When declared, transition actions merge into the table record menu and
     * the view page header. Pair the model with `HasStateTransitions` or let
     * the workflow definition supply the transition map.
     */
    public static function workflow(): ?Workflow
    {
        return null;
    }

    /**
     * The effective workflow: DB override when present, PHP default otherwise.
     *
     * Column and model always come from the PHP definition (they reference
     * code artifacts that cannot be invented from the UI). States and
     * transitions come from the DB when an override exists.
     */
    public static function resolvedWorkflow(): ?Workflow
    {
        $base = static::workflow();

        if ($base === null) {
            return null;
        }

        try {
            $override = WorkflowOverride::forResource(static::key());
        } catch (\Throwable) {
            return $base;
        }

        if ($override === null) {
            return $base;
        }

        $model = $base->getModel();

        return Workflow::fromStored([
            'column' => $base->column(),
            'group_label' => $override->group_label ?? $base->groupLabel(),
            'states' => $override->states,
            'transitions' => $override->transitions,
        ], is_subclass_of($model, Model::class) ? $model : null);
    }

    /** Optional write form. A resource without one is read-only. */
    public static function form(Form $form): Form
    {
        return $form;
    }

    /**
     * Prepare a record request before its form rules run.
     *
     * Hosts may normalize request input here (for example, trim a code or
     * map an external value) without replacing the panel's server-side form
     * validation. The request object is intentionally passed by reference so
     * `merge()`/`replace()` are available while the raw input is still intact.
     */
    public static function beforeValidate(Request $request): void {}

    /** @param array<string, mixed> $data */
    public static function afterValidate(array $data): void {}

    /** @param array<string, mixed> $data */
    public static function beforeCreate(Model $record, array $data): void {}

    /** @param array<string, mixed> $data */
    public static function afterCreate(Model $record, array $data): void {}

    /** @param array<string, mixed> $data */
    public static function beforeUpdate(Model $record, array $data): void {}

    /** @param array<string, mixed> $data */
    public static function afterUpdate(Model $record, array $data): void {}

    public static function beforeDelete(Model $record): void {}

    public static function afterDelete(Model $record): void {}

    public static function formDefinition(): Form
    {
        $form = static::form(Form::make());

        $fields = array_map(
            static fn (CustomField $f): Field => CustomFieldFactory::field($f),
            static::customFields(),
        );

        return $form->appendFields($fields);
    }

    /**
     * Optional layout for the VIEW page.
     *
     * A labelled value on a dedicated view page (`TextEntry`, `IconEntry`,
     * `ImageEntry`, `KeyValueEntry`, `ColorEntry`, `CodeEntry`,
     * `RepeatableEntry`, `BadgeEntry`, `DateTimeEntry`, `MoneyEntry`,
     * `ViewEntry`). Empty means the view falls back to table columns.
     *
     * @return list<Component|Renderable>
     */
    public static function infolist(): array
    {
        return [];
    }

    /**
     * The attribute that best identifies a record to a human - shown as the
     * View page's title instead of a raw ID.
     *
     * Checked in order against whichever of these attributes the model
     * actually carries; the client used to try only a literal `name`
     * (`ResourceView.vue`'s title fell back to `record.name ?? "#{id}"`), so
     * any model whose obvious display field was `full_name`, `title`, or
     * `label` showed its numeric ID as the page title instead - a raw `#5`
     * reads as an accident, not a design choice, and is worse than a page
     * that never tries to guess a name at all.
     *
     * EXPANDED, NOT JUST DOCUMENTED, after a six-resource consistency pass
     * found this exact gap live: `TicketResource` (a plain `subject` column)
     * showed `#54` as its View-page title with zero code changed, simply
     * because `subject` was not on this list. `subject`/`number`/`code` are
     * the same literal, ordinary-English-column-name candidates
     * `MakeResourceCommand::inferTitleAttribute()` already uses to guess a
     * RELATED model's display attribute for a generated `relationship()`
     * field - proven safe there, reused here for the resource's own record.
     *
     * DELIBERATELY LITERAL, NOT PATTERN-MATCHED. `invoice_number` and
     * `order_number` do not match `number` here, and are not meant to: a
     * suffix-matching rule (anything ending in `_number`/`_code`) would also
     * match a `phone_number` or `tracking_code` that was never meant to BE
     * the record's identity, and a wrong guess silently mislabelling every
     * record is worse than one that still falls through to `#id` and asks
     * for an explicit override.
     *
     * Override when the model's display attribute isn't one of these -
     * `InvoiceResource::recordTitle()` might return
     * `$record->invoice_number`, or combine two columns.
     */
    public static function recordTitle(Model $record): ?string
    {
        foreach (['name', 'title', 'full_name', 'subject', 'number', 'code', 'label', 'email'] as $attribute) {
            $value = $record->getAttribute($attribute);

            if (is_string($value) && trim($value) !== '') {
                return $value;
            }
        }

        return null;
    }

    /**
     * Per-tenant feature flag, if the resource declares one.
     *
     * Spec S9 item 5: a disabled feature hides the resource from navigation AND
     * returns 404 from its routes. Hiding the link alone is not a control - the
     * URL is still typeable, and an operator who bookmarks it keeps working.
     */
    protected static ?string $feature = null;

    public static function feature(): ?string
    {
        return static::$feature;
    }

    public static function module(): ?string
    {
        $module = static::$module;

        return $module === null || $module === '' ? null : $module;
    }

    /**
     * Request-time gate for plan modules. Feature flags still use `isEnabled()`
     * (404). An ungranted `$module` is 403 and is omitted from the sidebar.
     */
    public static function isAccessible(): bool
    {
        $module = static::module();

        return $module === null || moduleEnabled($module);
    }

    /**
     * Whether this resource is enabled for the acting tenant.
     *
     * Reads the flag through TenantContext rather than an ambient tenant()
     * call, so it works identically in shared and dedicated database modes.
     */
    public static function isEnabled(): bool
    {
        $feature = static::feature();

        if ($feature === null) {
            return true;
        }

        $flags = app(TenantContext::class)->features();

        // Absent means DISABLED. A missing flag is not permission - the whole
        // point of a flag is that it must be turned on deliberately.
        return (bool) ($flags[$feature] ?? false);
    }

    /**
     * Whether records may be brought in in BULK, from a file.
     *
     * OPT-IN. A SEPARATE QUESTION FROM `create`, and the default is no.
     * Import used to follow `isWritable()`, so every resource with a form grew
     * an Import button - plans, routers, people, tickets, the lot. Creating one
     * record is what those screens are for. Importing a spreadsheet is an
     * administrative act with a wizard, a mapping step and a write of hundreds
     * of rows behind it.
     *
     * Return true, or the importer class `make:panel-importer` wrote:
     *
     *     public static function importable(): bool|string
     *     {
     *         return OrderImporter::class;
     *     }
     *
     * A class string is still opt-in: it is truthy, and the kit uses that
     * class's `form()` when present. CSV is the default file type.
     *
     * Return true from a subclass that actually wants a CSV. `permissions()`
     * still ands `isWritable()` and `can('create')`, so a read-only list cannot
     * advertise Import even if a subclass gets this wrong.
     *
     * @return bool|class-string
     */
    public static function importable(): bool|string
    {
        return false;
    }

    /**
     * Accept .xlsx/.xls in the import dialog.
     *
     * OPTIONAL. CSV stays the kit path. This is off until the resource asks,
     * and Excel still needs `phpoffice/phpspreadsheet` (composer suggest).
     * Without that package the endpoint names it rather than fatalling.
     */
    public static function excelImport(): bool
    {
        return false;
    }

    public static function importForm(): Form
    {
        $importer = static::importable();

        if (is_string($importer) && class_exists($importer) && method_exists($importer, 'form')) {
            return $importer::form();
        }

        return static::formDefinition();
    }

    /** Whether a create or edit PAGE can be rendered at all. */
    public static function isWritable(): bool
    {
        return static::formDefinition()->fields() !== [];
    }

    /**
     * Whether any write path exists - a form OR an editable column.
     *
     * These are two different questions and conflating them was a bug: Plans
     * declares no form, so `isWritable()` is false, so `permissions()['update']`
     * came back false, so every inline switch on the Plans list rendered
     * DISABLED. The policy allowed the write and the endpoint would have
     * accepted it; only the UI hint said otherwise, which is the worst place for
     * the disagreement to live because it looks like a permissions problem.
     *
     * `create` still requires a form - a row cannot be brought into existence by
     * toggling a cell - which is why this is a second method rather than a
     * widening of the first.
     */
    public static function hasWritableColumns(): bool
    {
        foreach (static::definition()->getColumns() as $column) {
            if ($column instanceof InlineWritableColumn && $column->isInlineWritable()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Authorization. DENIES BY DEFAULT.
     *
     * A resource with no policy returns false rather than true. That inversion
     * is the whole point: the usual default means forgetting to write a policy
     * silently grants everyone everything, and the failure is invisible because
     * the page renders correctly for the person who forgot.
     *
     * The refusal is LOGGED, because a silently-denying panel is its own kind of
     * mystery - antipatterns opens on failures that returned 200 and looked
     * right, and "the button does nothing" is the same class of bug.
     *
     * Schema permission booleans only hide UI. Every write re-checks here, so a
     * client that lies gets a 403 rather than a mutation.
     */
    public static function can(string $ability, Model|string|null $record = null): bool
    {
        $model = static::model();

        if (Gate::getPolicyFor($model) === null) {
            Log::warning('Panel resource denied an ability because no policy is registered.', [
                'component' => 'Resource',
                'operation' => 'can',
                'resource' => static::key(),
                'model' => $model,
                'ability' => $ability,
            ]);

            return false;
        }

        return Gate::allows($ability, $record ?? $model);
    }

    /**
     * Permission booleans for the UI. Never a gate (spec S9 item 3).
     *
     * @return array<string, bool>
     */
    public static function permissions(): array
    {
        return [
            'viewAny' => static::can('viewAny'),
            'create' => static::isWritable() && static::can('create'),
            /*
             * A form, an editable column, OR a drag handle - all three are ways
             * to update a record.
             *
             * Reordering was missed at first, and the symptom was oblique: the
             * Reorder button simply never appeared on a table that declared
             * itself reorderable, because this flag gates the affordance and it
             * only knew about forms and cells. A resource whose only write is a
             * drag is still a resource you can write to.
             */
            'update' => (static::isWritable()
                || static::hasWritableColumns()
                || static::definition()->getReorderColumn() !== null)
                && static::can('update'),
            'delete' => static::can('delete'),

            // Its own flag rather than a reading of `create` - see
            // `importable()` for the screen that made the difference clear.
            'import' => (bool) static::importable()
                && static::isWritable()
                && static::can('create'),
            'excelImport' => static::excelImport()
                && class_exists(IOFactory::class),
        ];
    }

    /**
     * Related lists shown as tabs on the record page.
     *
     * Declared, never inferred: a relation appears because a resource named it,
     * so the endpoint can only ever open a list the author intended.
     *
     * @return list<RelationManager>
     */
    public static function relations(): array
    {
        return [];
    }

    public static function relation(string $key): ?RelationManager
    {
        foreach (static::relations() as $relation) {
            if ($relation->key === $key) {
                return $relation;
            }
        }

        return null;
    }

    /** URL segment and schema key, e.g. `clients`. */
    public static function key(): string
    {
        return str(class_basename(static::class))->beforeLast('Resource')->plural()->kebab()->value();
    }

    public static function label(): string
    {
        return str(class_basename(static::class))->beforeLast('Resource')->headline()->value();
    }

    public static function pluralLabel(): string
    {
        return str(static::label())->plural()->value();
    }

    public static function icon(): string
    {
        return static::$icon;
    }

    public static function group(): ?string
    {
        return static::$group;
    }

    /**
     * WIDGETS ABOVE THIS RESOURCE'S LIST SCREEN.
     *
     * THE MOST-WANTED PLACE FOR A STAT CARD AND, UNTIL NOW, THE ONE PLACE IT
     * COULD NOT GO. `Panel::widgets()` made widgets registerable and
     * `DashboardPage` was still the only screen that resolved them - so the
     * answer to "put the open-ticket count above the ticket list" was a custom
     * page that reimplemented the list. A widget system with exactly one host
     * is a dashboard feature wearing a framework's name.
     *
     * DECLARED HERE RATHER THAN REGISTERED ON THE PANEL, because these belong
     * to a RESOURCE: "invoices overdue" is meaningless above the routers list,
     * and a panel-level registration would have to name its screen anyway.
     * Filament splits it the same way - `Panel::widgets()` for the dashboard,
     * `Resource::getWidgets()` for a resource's own screens.
     *
     * PERMISSION AND ROUND TRIPS ARE `WidgetSet`'s, not this method's. A widget
     * the viewer may not see is never sent and its query never runs, and the
     * whole row is ONE deferred request rather than one per card - both rules
     * are the dashboard's, shared rather than re-derived, because getting them
     * subtly different on a second surface is how a panel leaks a number here
     * that it correctly withholds there.
     *
     * @return list<StatWidget|ChartWidget|TableWidget>
     */
    /**
     * Stat strip above this resource's index. Deferred through `WidgetSet`.
     *
     * Prefer this over `headerWidgets()` on new resources. When empty, the
     * controller falls back to `headerWidgets()` for backwards compatibility.
     *
     * @return list<StatWidget|ChartWidget|TableWidget>
     */
    public static function indexMetrics(): array
    {
        return [];
    }

    /**
     * @return list<StatWidget|ChartWidget|TableWidget>
     */
    public static function headerWidgets(): array
    {
        return [];
    }

    /**
     * Widgets below this resource's index - see `Page::footerWidgets()` for
     * why the row exists at both ends. No `indexMetrics()`-style preferred
     * alias here: that split is about naming two header methods for the
     * same slot, which a single footer method has no reason to repeat.
     *
     * @return list<StatWidget|ChartWidget|TableWidget>
     */
    public static function footerWidgets(): array
    {
        return [];
    }

    /**
     * @return list<StatWidget|ChartWidget|TableWidget>
     */
    public static function resolvedIndexWidgets(): array
    {
        $metrics = static::indexMetrics();

        return $metrics !== [] ? $metrics : static::headerWidgets();
    }

    /**
     * Nova-style alternate index views. Empty means the default table only.
     *
     * @return list<class-string|Lens>
     */
    public static function lenses(): array
    {
        return [];
    }

    /**
     * Opt-in Kanban board. Null (default) means the board actions 404.
     *
     * Routes are registered for every resource; without `board()` the GET
     * and POST handlers refuse with 404. Zero client cost until declared.
     *
     *     public static function board(): ?Board
     *     {
     *         return Board::make('status')->columns([
     *             'open' => 'Open',
     *             'doing' => 'In progress',
     *             'done' => 'Done',
     *         ])->title('name');
     *     }
     */
    public static function board(): ?Board
    {
        return null;
    }

    /**
     * Opt-in record comments. Null (default) means comment routes 404 and the
     * view page ships no comments section. Zero client cost until declared.
     *
     *     public static function comments(): ?Comments
     *     {
     *         return Comments::make()->label('Discussion');
     *     }
     */
    public static function comments(): ?Comments
    {
        return null;
    }

    public static function hasComments(): bool
    {
        return static::comments() !== null;
    }

    /**
     * May the current user post a comment on this record?
     *
     * View uses `view`. Create uses `update` OR `comment` unless the resource
     * configured `commentAbilityOnly()`.
     */
    public static function canComment(?Model $record = null): bool
    {
        $config = static::comments();

        if ($config === null) {
            return false;
        }

        if ($config->requiresCommentAbilityOnly()) {
            return static::can('comment', $record);
        }

        return static::can('update', $record) || static::can('comment', $record);
    }

    /** Fluent per-resource overrides for page vs modal CRUD. */
    public static function configure(): ResourceConfigurator
    {
        return ResourceConfigurator::for(static::class);
    }

    /** @return array{create: string, edit: string, view: string} */
    public static function formPresentation(): array
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return ResourceConfigurator::formsFor(
            static::class,
            $panel?->getResourceForms() ?? ResourceConfigurator::MODE_PAGE,
        );
    }

    public static function resolveLens(?string $key): ?Lens
    {
        return ResourceConfigurator::findLens(static::class, $key);
    }

    /** @return list<Lens> */
    public static function resolvedLenses(): array
    {
        return ResourceConfigurator::resolvedLenses(static::class);
    }

    /** @return class-string<Cluster>|null */
    public static function cluster(): ?string
    {
        return static::$cluster;
    }

    /** @return class-string<\Alxtexh\Panel\Resources\Resource>|null */
    public static function parentResource(): ?string
    {
        return static::$parent;
    }

    /** The foreign key column that points at the parent record. */
    public static function parentColumn(): string
    {
        if (static::$parentColumn !== null) {
            return static::$parentColumn;
        }

        $parent = static::parentResource();

        return str($parent === null ? 'parent' : $parent::key())
            ->singular()->snake()->append('_id')->value();
    }

    /**
     * BelongsToMany method on the parent model, or null for HasMany nested resources.
     */
    public static function relationship(): ?string
    {
        $name = static::$relationship;

        return $name === null || $name === '' ? null : $name;
    }

    /**
     * Extra columns on the pivot table itself - a role, an `expires_at` - for a
     * BelongsToMany nested resource. Empty for every other kind of resource.
     *
     * Collected once at attach time (the same values applied to every id in
     * that submission, not per-row), editable afterwards through an
     * auto-registered "Edit pivot" row action next to "Detach", and shown as
     * its own column on the nested list - `RelationManager::withPivotColumns()`
     * reads each one through its own correlated subquery rather than a join,
     * which would risk multiplying rows the moment a pair has more than one
     * pivot row.
     *
     * @return list<Field>
     */
    public static function pivotColumns(): array
    {
        return [];
    }

    /**
     * An infolist entry action by key, or null.
     *
     * The infolist-action endpoint resolves through this, the same way table
     * record actions resolve through `Table::recordAction()`.
     */
    public static function infolistAction(string $key): ?Action
    {
        return self::findInfolistAction(static::infolist(), $key);
    }

    /**
     * @param  list<Component|Renderable>  $nodes
     */
    private static function findInfolistAction(array $nodes, string $key): ?Action
    {
        foreach ($nodes as $node) {
            if ($node instanceof Entry) {
                $action = $node->getAction();

                if ($action !== null && $action->key === $key) {
                    return $action;
                }
            }

            if ($node instanceof Component) {
                $found = self::findInfolistAction($node->children(), $key);

                if ($found !== null) {
                    return $found;
                }
            }
        }

        return null;
    }

    public static function purpose(): ?string
    {
        return static::$purpose;
    }

    /**
     * Whether this resource appears in the navigation.
     *
     * ROUTABLE BUT UNLISTED. Some resources exist to be reached rather than
     * browsed - a fixture that exercises an endpoint, a screen linked to only
     * from another record, an admin-only table that should not advertise
     * itself. Hiding is a NAVIGATION decision and nothing else: the routes
     * still exist and every policy still applies, because a resource absent
     * from a menu is not a resource nobody can reach.
     */
    public static function showsInNavigation(): bool
    {
        // A nested resource has no URL of its own to link - every instance of
        // its screen belongs to some parent record. It is reached from the
        // parent, so the sidebar has nothing true to say about it.
        return static::parentResource() === null;
    }

    public static function navigationSort(): int
    {
        return static::$sort ?? 0;
    }

    /**
     * Whether this resource belongs in the API reference.
     *
     * NOT EVERY RESOURCE IS AN INTEGRATION SURFACE. An internal read-only trail
     * - the activity log is the case that prompted this - has real endpoints
     * that nobody will ever call from outside, and listing it only lengthens a
     * document somebody is reading to find the endpoint they actually need.
     * Volume is not thoroughness in a reference.
     *
     * SEPARATE FROM `showsInNavigation()`, deliberately, because they answer
     * different questions. A resource can be worth a menu entry and useless to
     * an integrator, or the reverse: an endpoint reached only by a machine
     * belongs in the document and in no menu at all. One flag serving both would
     * force those two to agree.
     *
     * OPT-OUT, NOT OPT-IN. A resource that says nothing appears and gets edited
     * down; the alternative is a reference silently missing what nobody
     * remembered to declare, which is indistinguishable from an endpoint that
     * does not exist.
     */
    public static function documented(): bool
    {
        return true;
    }

    /** @return class-string<Model> */
    public static function model(): string
    {
        return static::$model;
    }

    /* ------------------------------------------------- the command palette */

    /**
     * Shape what the palette searches, without touching what the list shows.
     *
     * THE SEARCH ENDPOINT USED TO REUSE THE LIST QUERY WHOLESALE, which was the
     * right instinct - one search implementation, one tenant scope, one set of
     * searchable columns - and left no seam at all: a resource that wanted the
     * palette to skip archived rows, or to prefer recent ones, had no place to
     * say so short of changing its list screen too. This hook runs at the
     * ELOQUENT stage, before scopes resolve, so a constraint here composes with
     * tenancy rather than fighting it.
     *
     * The default does nothing, which is the previous behaviour exactly.
     */
    /** @param EloquentBuilder<Model> $query */
    public static function modifySearchQuery(EloquentBuilder $query, string $term): void {}

    /**
     * How many rows this resource may put in the palette.
     *
     * A CONSTANT FOR EVERYBODY WAS WRONG IN BOTH DIRECTIONS - five activity
     * rows crowd out the client somebody typed a name for, while a panel with
     * two resources could comfortably show more of each. Per-resource, so the
     * one pathological resource is solved where it lives.
     */
    public static function searchResultLimit(): int
    {
        return 5;
    }

    /**
     * The column that tells two same-titled results apart, or null to let the
     * endpoint guess.
     *
     * Five rows all reading "100Mbps Business" are indistinguishable, which
     * makes the palette a list you cannot choose from. The endpoint's guess is
     * the second sensible text column; a resource that knows better names it
     * here.
     */
    public static function searchSubtitleColumn(): ?string
    {
        return null;
    }

    /**
     * Where this resource's results sit among the palette's groups.
     *
     * REGISTRATION ORDER IS ARBITRARY AND WAS BEING TREATED AS A RANKING. The
     * groups came back in whatever order discovery happened to glob the
     * directory, so the activity trail could sit above the customers somebody
     * typed a name to find - and the first group is the one a person reads,
     * the one arrow-down lands in, and the one Enter opens. An accident of
     * filesystem ordering was deciding what a keystroke did.
     *
     * LOWER SORTS FIRST, ties keep their registration order, and the default
     * of 0 for everything reproduces today's behaviour exactly - so this
     * changes nothing until a resource says something.
     */
    public static function searchSort(): int
    {
        return 0;
    }

    /**
     * How strongly this resource's rows count for command palette ranking.
     *
     * Applied as a multiplier to the relevance score the search endpoint
     * computes, and defaults to `1` so it is a no-op unless a resource
     * overrides it.
     */
    public static function searchWeight(): float
    {
        return 1;
    }

    public static function definition(): Table
    {
        $table = static::table(Table::make());

        if (NestedRelation::belongsToMany(static::class) && $table->recordAction('detach') === null) {
            $resource = static::class;

            $table->recordActions([
                ...$table->getRecordActions(),
                RecordAction::make('detach', 'Detach')
                    ->authorize('update')
                    ->destructive()
                    ->confirm('Detach this record from the parent?')
                    ->removesRow()
                    ->handle(static function (Model $record) use ($resource): void {
                        $parent = NestedContext::parent(request(), $resource);

                        abort_if($parent === null, 404);

                        NestedRelation::of($parent, $resource)->detach($record->getKey());
                    }),
            ]);
        }

        if (
            NestedRelation::belongsToMany(static::class)
            && static::pivotColumns() !== []
            && $table->recordAction('edit-pivot') === null
        ) {
            $resource = static::class;

            $table->recordActions([
                ...$table->getRecordActions(),
                RecordAction::make('edit-pivot', 'Edit pivot')
                    ->authorize('update')
                    ->form(static fn (Form $form): Form => $form->schema($resource::pivotColumns()))
                    ->handle(static function (Model $record, array $data) use ($resource): void {
                        $parent = NestedContext::parent(request(), $resource);

                        abort_if($parent === null, 404);

                        NestedRelation::of($parent, $resource)->updateExistingPivot($record->getKey(), $data);
                    }),
            ]);
        }

        $workflow = static::resolvedWorkflow();

        if ($workflow !== null) {
            $table = $workflow->applyTo($table);
        }

        $definitions = static::customFields();

        if ($definitions === []) {
            return $table;
        }

        // The COLUMN and the SQL that fills it travel separately - see
        // `CustomFieldFactory::column()`'s own note on why a raw JSON
        // extraction cannot go through `Column::from()`.
        $columns = array_map(
            static fn (CustomField $f): Column => CustomFieldFactory::column($f),
            $definitions,
        );

        $select = array_map(
            static fn (CustomField $f): QueryExpression => CustomFieldFactory::selectExpression($f),
            $definitions,
        );

        return $table->appendColumns($columns)->appendSelect($select);
    }

    /**
     * The cached, tenant-independent half of the contract.
     *
     * The envelope carries `v` and `kind` from the start - spec §5 requires the
     * contract be versioned, and it is what lets a second schema shape be added
     * later without breaking a consumer that only understands `resource`.
     *
     * @return array<string, mixed>
     */
    public static function schema(?string $panelId = null): array
    {
        /*
         * THE RESOURCE'S OWN PANEL, not a literal default.
         *
         * The key was previously built with `'admin'` whenever a caller did not
         * say otherwise, which was harmless while one panel existed and becomes
         * a leak with three: a super-admin resource and a tenant-admin resource
         * with the same key would share a cache entry, so whichever panel warmed
         * it first would decide what the other one saw. Column sets differ
         * between panels precisely because their audiences differ.
         */
        $panelId ??= static::panel();

        $cache = app(SchemaCache::class);

        /*
         * THE PANEL'S PATH, IN FRONT OF EVERY URL THIS SCHEMA HANDS OUT.
         *
         * IT WAS MISSING, AND THE SECOND PORTAL WAS BROKEN PAST ITS FIRST
         * SCREEN. The routes below were built from the resource key alone -
         * `/reseller-plans/create`, `/reseller-plans/{id}` - which is correct
         * in exactly one panel: the one mounted at the root. On a portal
         * mounted at `/reseller`, the index rendered perfectly and then every
         * link off it went to a URL that panel does not serve. New, the row
         * links, the form's own submit target, the upload endpoint, the
         * field-options lookup - all of them, because they are all built from
         * `routes.index` on the client.
         *
         * It survived because the index page is the one screen that needs no
         * link to work, and it is the screen anybody checks when asking
         * whether a generated portal works.
         *
         * This is the export download's bug one layer up, and the fix is the
         * same shape: the prefix comes from the PANEL, resolved where the
         * panel is known, rather than assembled by each caller. Cached safely
         * because the schema cache key already includes the panel id.
         */
        $prefix = rtrim('/'.trim(app(PanelManager::class)->panel($panelId)?->getPath() ?? '', '/'), '/');

        /*
         * WHETHER THIS PANEL EVEN HAS AN AUDIT ROUTE. `PanelRoutes::host()`
         * says why the package cannot register it itself - it hangs off an
         * application controller `panel:install` never scaffolds. Sending the
         * route unconditionally on every resource meant `<AuditTimeline>`
         * rendered a "History" section that 404s in a permanent retry loop on
         * every fresh install, for every resource, before anyone wires one -
         * the same `Route::has()` guard `SettingsNav::url()` already uses for
         * exactly this reason.
         */
        $panelRouteName = app(PanelManager::class)->panel($panelId)?->getRouteName();
        $auditRouteName = $panelRouteName === null ? null : $panelRouteName.'audit';

        return $cache->remember(
            $panelId,
            static::key(),
            static::permissionsFingerprint(),
            static function () use ($prefix, $auditRouteName): array {
                $table = static::definition();

                return [
                    'v' => 1,
                    'kind' => 'resource',
                    'key' => static::key(),
                    'label' => static::label(),
                    'labelPlural' => static::pluralLabel(),
                    'purpose' => static::purpose(),
                    'icon' => static::icon(),
                    'group' => static::group(),
                    'routes' => [
                        'index' => $prefix.'/'.static::key(),
                        'store' => $prefix.'/'.static::key(),
                        'update' => $prefix.'/'.static::key().'/{id}',
                        'destroy' => $prefix.'/'.static::key().'/{id}',
                        'board' => static::board() !== null
                            ? $prefix.'/'.static::key().'/board'
                            : null,
                        'boardMove' => static::board() !== null
                            ? $prefix.'/'.static::key().'/board-move'
                            : null,
                        'workflow' => static::workflow() !== null
                            ? $prefix.'/'.static::key().'/workflow'
                            : null,
                        'comments' => static::hasComments()
                            ? $prefix.'/'.static::key().'/{id}/record-comments'
                            : null,
                        'audit' => $auditRouteName !== null && Route::has($auditRouteName)
                            ? $prefix.'/'.static::key().'/{id}/audit'
                            : null,
                    ],
                    'table' => $table->toSchema(),
                    'form' => static::formDefinition()->toSchema(),
                    'infolist' => array_map(
                        static fn (Component|Renderable $c): array => $c->toSchema(),
                        static::infolist(),
                    ),
                    // Structure only - column definitions for each related list.
                    // The rows are fetched on demand, never with the parent.
                    'relations' => array_map(
                        static fn (RelationManager $r): array => $r->toSchema(),
                        static::relations(),
                    ),
                    'forms' => static::formPresentation(),
                    'lenses' => array_map(
                        static fn (Lens $lens): array => $lens->toSchema(),
                        static::resolvedLenses(),
                    ),
                    'board' => static::board()?->toSchema(),
                    'workflow' => static::workflow()?->toSchema(),
                ];
            },
            static::customFieldsFingerprint(),
        );
    }

    /**
     * The actions this resource supports at all.
     *
     * EVERY ACTION BY DEFAULT, narrowed by resources that genuinely cannot do
     * some of them. An audit trail is the clearest case: entries are written by
     * the recorder and never edited, so `create_activity` and `delete_activity`
     * are abilities that can be granted and mean nothing. A permission matrix
     * that offers them is teaching people it lies.
     *
     * NARROWING IS NOT AUTHORISATION. The policy still decides who may do the
     * actions that remain; this only decides which ones are on the menu.
     *
     * @return list<string>
     */
    public static function actions(): array
    {
        return Abilities::ACTIONS;
    }

    /** @return list<CustomField> */
    protected static function customFields(): array
    {
        $fields = [];
        foreach (CustomField::forResource(static::key())->all() as $field) {
            $fields[] = $field;
        }

        return $fields;
    }

    /**
     * A fingerprint of this resource's custom field definitions, or an empty
     * string.
     *
     * EMPTY IS THE IMPORTANT CASE. It is what keeps the schema cache key
     * unchanged for a resource nobody has added a custom field to, which is
     * most resources most of the time. See `SchemaCache::key`.
     *
     * The hash covers the DEFINITIONS (installation-wide, not per tenant -
     * see the migration's own note), so adding, editing or removing one
     * invalidates only the schemas that contain it, and does so without
     * anybody remembering to clear a cache.
     */
    protected static function customFieldsFingerprint(): string
    {
        $fields = static::customFields();

        if ($fields === []) {
            return '';
        }

        return substr(hash('xxh128', json_encode($fields) ?: ''), 0, 12);
    }

    /**
     * Rows, filter options and counts. Never cached, always tenant-scoped.
     *
     * Accepts an already-built definition so a caller that needs both the data
     * AND the filter options does not build the table twice. Building it twice
     * means two sets of filter instances, and a data-derived option closure then
     * runs once per set - a duplicate DISTINCT query per request that no test
     * would notice because the row count is identical either way.
     */
    public static function data(Request $request, ?Table $definition = null): ListResult
    {
        return ($definition ?? static::definition())->toListQuery(static::model())->run($request);
    }

    /**
     * Hash of the acting user's effective permission set.
     *
     * Schemas vary by role - a user without `delete_client` must not receive a
     * delete action - so the fingerprint keys the cache. It is deliberately NOT
     * a tenant id: the schema contains no tenant data (addendum Part A).
     *
     * Reused as the per-request permission lookup (addendum C), so permissions
     * resolve once and serve both purposes.
     */
    protected static function permissionsFingerprint(): string
    {
        $user = Auth::user();

        if ($user === null) {
            return 'guest';
        }

        // Spatie's API when present; a stable fallback when it is not. Never an
        // empty string - SchemaCache throws on that rather than collapsing every
        // role onto one key (antipatterns §1.5).
        if (method_exists($user, 'getAllPermissions')) {
            $names = $user->getAllPermissions()->pluck('name')->sort()->implode(',');

            return substr(hash('xxh128', $names), 0, 16);
        }

        return 'default';
    }
}
