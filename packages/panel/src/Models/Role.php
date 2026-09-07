<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Models;

use Spatie\Permission\Models\Role as SpatieRole;

/**
 * A named set of abilities, belonging to one organisation.
 *
 * EXTENDS SPATIE'S RATHER THAN REPLACING IT, so the package's own machinery -
 * the pivot tables, the permission cache, `hasPermissionTo` - keeps working
 * while the panel adds the two things it needs on top.
 *
 * NO TENANT GLOBAL SCOPE HERE, and that is the change from the hand-rolled
 * version. Spatie's teams feature scopes roles by `tenant_id` itself, driven by
 * the team id set in `SetPermissionsTeam` - adding a second scope on top would
 * mean two mechanisms answering the same question, which is how they come to
 * disagree. The tenant column is still there and still enforced; it is enforced
 * once.
 */
/**
 * THE COLUMNS THIS PACKAGE ADDS TO SPATIE'S ROLE - see `Alerts\Announcement`.
 *
 * ONLY THE ADDITIONS ARE LISTED. `id`, `name` and `guard_name` come from the
 * parent and are already typed there; repeating them would be a second
 * declaration to keep in step with somebody else's package.
 *
 * `team_id` IS SPATIE'S TEAM KEY, which this installation maps to the tenant -
 * nullable because a role created outside any request has no team, which is
 * the state `panel:permissions` runs in and the one that has caused this
 * codebase four separate bugs.
 *
 * @property bool $grants_all
 * @property int|null $team_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 */
class Role extends SpatieRole
{
    protected $casts = [
        'grants_all' => 'boolean',
    ];

    /**
     * A role that holds every ability, including ones invented later.
     *
     * Spatie has no equivalent, and inferring it from "currently holds every
     * permission" would make a role become a superuser by accident the moment
     * somebody ticked the last box. `panel:permissions sync` tops such a role up
     * so registering a resource cannot lock its administrators out of it.
     */
    public function grantsEverything(): bool
    {
        return (bool) $this->grants_all;
    }

    /**
     * Whether this role grants `$ability`.
     *
     * KEPT AS THE PANEL'S OWN VERB even though Spatie has `hasPermissionTo`,
     * because `grants_all` is ours: a role that holds every ability including
     * ones invented later. Callers should not have to remember to check both.
     */
    public function grants(string $ability): bool
    {
        if ($this->grantsEverything()) {
            return true;
        }

        return $this->permissions->contains('name', $ability);
    }

    /**
     * The FIRST role this organisation ever had, which cannot be deleted.
     *
     * Not a flag, because a flag can be unset. Whatever else has been
     * misconfigured, one role always exists and can be assigned - delete it and
     * an organisation can reach a state where nobody holds a usable role and the
     * screen that would fix that is itself behind a permission nobody has.
     */
    public function isProtected(): bool
    {
        return $this->getKey() === self::query()
            ->where('tenant_id', $this->getAttribute('tenant_id'))
            ->orderBy('id')
            ->value('id');
    }
}
