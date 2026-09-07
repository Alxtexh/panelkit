<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\PanelManager;

/**
 * The canonical list of ability names, derived from the registered resources.
 *
 * NAMES ARE DERIVED, NEVER STORED. `update_client` exists because a resource
 * keyed `clients` is registered and `update` is an ability the panel performs -
 * it is a fact about the code, not a row somebody typed. A `permissions` table
 * would be a second copy that can disagree with the registry, and the way it
 * disagrees is the dangerous direction: a resource is renamed, the old ability
 * name lingers in a role, and the role silently grants nothing while looking
 * fully populated.
 *
 * So the list is computed, and `panel:permissions sync` is a reconciliation
 * rather than a generator: it prunes names that no longer correspond to
 * anything, which is the part that actually matters.
 *
 * THE ABILITY SET MATCHES THE POLICY, deliberately. `restore` and `forceDelete`
 * are separate from `delete` because the base policy treats them separately, and
 * a permission matrix that cannot express "may correct a record, may not
 * permanently destroy one" is a matrix that will be worked around.
 */
final class Abilities
{
    /**
     * Every ability the panel checks, in the order a matrix should show them.
     *
     * `viewAny` before `view` because the list page is what you reach first, and
     * `forceDelete` last because it is the one with no undo.
     */
    public const ACTIONS = ['viewAny', 'view', 'create', 'update', 'delete', 'restore', 'forceDelete'];

    /**
     * Abilities that belong to the panel rather than to any resource.
     *
     * `manage_roles` IS THE ONE THAT MATTERS, and it must be a separate ability
     * rather than something implied by being an administrator. The matrix screen
     * edits what everybody may do, including the editor - so whoever holds this
     * can grant themselves anything. Making it explicit means it can be withheld
     * from a role that otherwise has full access to the data, which is the exact
     * separation an operations team needs: manage every subscriber, change
     * nobody's permissions.
     *
     * `impersonate_users` IS SEPARATE FROM MANAGING USERS for the same reason.
     * Seeing an operator's screens as them is a different act from editing their
     * account - support needs the first and often should not have the second -
     * and an ability that implied the other would make that split impossible to
     * express. What it can never do is reach upward; see `Impersonation`.
     */
    /*
     * `manage_backups` IS SEPARATE FROM `view_operations` because looking and
     * destroying are different acts. Everyone on an operations rota should be
     * able to see whether last night's backup ran; deleting a snapshot and
     * restoring over the live database is a much smaller circle, and one
     * ability covering both would mean granting the second to get the first.
     */
    /*
     * `manage_documents` GATES THE TEMPLATES EVERY INVOICE IS PRINTED FROM.
     *
     * The document screens had NO ability check of any kind - the route group
     * asked only for `auth`, and the controller asked for nothing. So the
     * lowest-privilege operator on a panel that offers documents could rewrite
     * the title, footer, support phone and support email carried by every
     * invoice and receipt the business subsequently sent out. Nothing logged a
     * denial, because nothing was asked.
     *
     * IT IS IN THIS LIST, WHICH IS THE HALF THAT MAKES IT REAL. An ability the
     * controller checks and `panel:permissions sync` never creates is one
     * nobody can hold - the screen would simply 403 for everybody except a
     * `grants_all` role. `manage_assistant` is currently in exactly that state,
     * gated in `AssistantSettingsController` and absent from here.
     */
    public const PANEL = ['manage_roles', 'impersonate_users', 'view_operations', 'manage_backups', 'manage_documents', 'manage_api_keys', 'manage_invites', 'manage_feature_flags', 'manage_webhooks', 'manage_mail_settings'];

    /**
     * What each panel ability is called on the permission matrix.
     *
     * ON THE SERVER, BESIDE THE NAMES THEY DESCRIBE. These labels were a
     * hardcoded map inside the Vue component, which was correct while
     * `manage_roles` was the only one and became wrong the moment a second
     * existed: an ability added in PHP rendered under whatever caption the
     * component happened to have, or under a guessed one. A name and its label
     * are one declaration.
     */
    public const PANEL_LABELS = [
        'manage_roles' => 'Manage roles and permissions',
        'impersonate_users' => 'Sign in as another person (impersonate)',
        'view_operations' => 'See backups and server logs',
        'manage_backups' => 'Delete, restore and reschedule backups',
        'manage_documents' => 'Edit the templates invoices and receipts print from',
        'manage_api_keys' => 'Create and revoke API keys',
        'manage_invites' => 'Send and revoke staff invites',
        'manage_feature_flags' => 'Toggle tenant feature flags',
        'manage_webhooks' => 'Manage webhook endpoints and deliveries',
        'manage_mail_settings' => 'Set and test the outgoing SMTP server',
    ];

    /**
     * Panel abilities the APPLICATION declares, as `name => label`.
     *
     * The package cannot know that an installation wants revenue figures hidden
     * from the support rota - that is a fact about the business. Declaring it in
     * config makes the name real: a superuser role covers it, the matrix offers
     * it, and `panel:permissions sync` stops pruning it as unknown.
     *
     * @return array<string, string>
     */
    public static function extra(): array
    {
        $declared = (array) config('panel.abilities', []);

        $out = [];

        foreach ($declared as $name => $label) {
            /*
             * A BARE LIST IS ACCEPTED and humanised, because the shape people
             * reach for first is `['view_revenue_widgets']` and failing on it
             * would be pedantry. A label given explicitly always wins.
             */
            if (is_int($name)) {
                $name = (string) $label;
                $label = ucfirst(str_replace('_', ' ', $name));
            }

            $out[(string) $name] = (string) $label;
        }

        return $out;
    }

    /**
     * Every panel-level ability with its label, the package's and the app's.
     *
     * @return array<string, string>
     */
    public static function panelLabelled(): array
    {
        $out = [];

        foreach (self::PANEL as $name) {
            $out[$name] = self::PANEL_LABELS[$name];
        }

        return [...$out, ...self::extra()];
    }

    /**
     * `{action}_{resource}` for every registered resource.
     *
     * @return list<string>
     */
    public static function all(): array
    {
        $out = [];

        foreach (app(PanelManager::class)->resources() as $key => $class) {
            /*
             * THE RESOURCE DECIDES WHICH ACTIONS EXIST FOR IT. A read-only
             * resource - an audit trail, a report - has no `delete` to grant,
             * and offering one in the permission matrix is worse than noise: it
             * is a checkbox somebody ticks believing it does something.
             */
            foreach ($class::actions() as $action) {
                $out[] = self::name($action, $key);
            }
        }

        /*
         * PAGES CONTRIBUTE THEIR ABILITY TOO. A page declares one name and
         * an ability per action; if they are not in this list they are not in
         * the permission matrix, `grants_all` never tops them up, and
         * `panel:permissions --prune` deletes them as names that correspond to
         * nothing. All three failures are silent, and the third is the one that
         * revokes a grant somebody deliberately made.
         */
        foreach (app(PanelManager::class)->pages() as $class) {
            if ($class::ability() !== null) {
                $out[] = $class::ability();
            }

            foreach ($class::actions() as $ability) {
                if ($ability !== null) {
                    $out[] = $ability;
                }
            }
        }

        return array_values(array_unique(array_merge($out, array_keys(self::panelLabelled()))));
    }

    /**
     * Grouped by resource, for rendering.
     *
     * @return array<string, list<array{action: string, name: string}>>
     */
    public static function grouped(): array
    {
        $out = [];

        foreach (app(PanelManager::class)->resources() as $key => $class) {
            $out[$class::label()] = array_map(
                static fn (string $action): array => [
                    'action' => $action,
                    'name' => self::name($action, $key),
                ],
                $class::actions(),
            );
        }

        return $out;
    }

    /**
     * The ability name for an action on a resource key.
     *
     * `viewAny` becomes `view_any_clients` rather than `viewAny_clients`: the
     * names appear in a UI and in support conversations, so one convention
     * throughout beats preserving the camelCase of the policy method.
     */
    public static function name(string $action, string $resourceKey): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $action)).'_'.str_replace('-', '_', $resourceKey);
    }

    /**
     * The ability name for an action on a MODEL, or null if nothing registers it.
     *
     * Null is the important return. A policy asked about a model with no
     * resource has no ability name to check, and the caller must decide what
     * that means rather than being handed a plausible-looking string that no
     * role will ever contain - which would deny silently and look like a
     * permissions bug rather than a registration one.
     */
    public static function forModel(string $action, Model|string $model): ?string
    {
        $class = is_string($model) ? $model : $model::class;

        foreach (app(PanelManager::class)->resources() as $key => $resource) {
            if ($resource::model() === $class) {
                return self::name($action, $key);
            }
        }

        return null;
    }
}
