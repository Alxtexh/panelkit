<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_demo_root_points_to_the_panel_home()
    {
        $response = $this->get('/');

        $response->assertRedirect('/dashboard');
    }
}
