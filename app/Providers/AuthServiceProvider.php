<?php

namespace App\Providers;

use App\Models\Menu;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            $menus = (new Menu())->allMenuWithRole();
            
            foreach ($menus as $menu) {
                Gate::define(
                    $menu->route_name,
                    fn($user) =>
                    $user->hasRole($menu->roles->pluck('role.name')->all())
                );
            }
            
        } catch (\Throwable $th) {
            Log::error(sprintf("ERROR >> [%s]", $th->getMessage()));
        }
    }
}
