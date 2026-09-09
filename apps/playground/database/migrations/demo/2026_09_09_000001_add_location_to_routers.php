<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Where the device sits, for the network coverage map.
 *
 * `{ lat, lng }`, the exact shape `MapField`/`MapWidget` already speak - not a
 * PostGIS point or two separate columns, because nothing here needs a spatial
 * index or a radius query, only a pin on a Leaflet map.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('routers', function (Blueprint $table) {
            $table->json('location')->nullable()->after('ip_address');
        });
    }

    public function down(): void
    {
        Schema::table('routers', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
