<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A free-text model name, for the "Other" option on `model`.
 *
 * `RouterResource::form()` had this bound to `status` instead - the SAME
 * column `IconColumn::make('status')` reads as online/offline/degraded and
 * the dashboard filters "routers online" by. Every create through the wizard
 * sent `status: null` (the field is empty unless model = "other"), which
 * `forceFill()` writes verbatim - bypassing the column's own
 * `->default('online')`, since a default only fills a column the insert
 * OMITS, not one it explicitly nulls - and the NOT NULL constraint on
 * `status` then rejected the whole insert. Confirmed live: creating any
 * router with a listed model (never "other") failed every time.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routers', function (Blueprint $table) {
            $table->string('model_other')->nullable()->after('model');
        });
    }

    public function down(): void
    {
        Schema::table('routers', function (Blueprint $table) {
            $table->dropColumn('model_other');
        });
    }
};
