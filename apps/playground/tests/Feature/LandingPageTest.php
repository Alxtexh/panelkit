<?php

declare(strict_types=1);

namespace Tests\Feature;

use Tests\TestCase;

/** The demo no longer advertises generic landing pages as reference samples. */
final class LandingPageTest extends TestCase
{
    public function test_no_generic_landing_templates_are_exposed(): void
    {
        $this->get('/preview/aurora')->assertNotFound();
        $this->get('/preview/restaurant')->assertNotFound();
        $this->get('/landing/dashboard')->assertNotFound();
        $this->get('/landing-template')->assertNotFound();
        $this->get('/api/landing-template')->assertNotFound();
    }
}
