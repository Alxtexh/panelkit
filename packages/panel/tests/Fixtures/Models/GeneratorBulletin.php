<?php

declare(strict_types=1);

namespace App\Models;

use Alxtexh\Panel\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * A second generator-only fixture, distinct from {@see GeneratorArticle}.
 *
 * "Article" is already a claimed resource key: tests/Fixtures/Resources/
 * ArticleResource.php registers one under the shared "admin" test panel via
 * config('panel.discover'), and MakeResourceGenerateTest's HTTP smoke test
 * needs `refreshApplication()` to make the freshly-generated resource
 * routable - which re-runs discovery and collides two different classes on
 * the same [articles] key. Reusing the already-migrated `articles` table
 * under a different model/class name sidesteps the collision without a new
 * migration.
 */
#[ScopedBy(TenantScope::class)]
class Bulletin extends Model
{
    use SoftDeletes;

    protected $table = 'articles';

    protected $guarded = [];
}
