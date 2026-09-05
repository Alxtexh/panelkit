<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('panel_bulk_action_checkpoints', function (Blueprint $table): void {
            $table->uuid('token');
            $table->string('cursor', 191);
            $table->string('status', 16)->default('running');
            $table->unsignedBigInteger('selected')->default(0);
            $table->unsignedBigInteger('authorized')->default(0);
            $table->unsignedBigInteger('affected')->default(0);
            $table->timestamps();

            $table->unique(['token', 'cursor']);
            $table->index(['token', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('panel_bulk_action_checkpoints');
    }
};
