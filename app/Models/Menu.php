<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        "label",
        "route_name",
        "icon",
        "type",
        "is_parent",
        "parent_id",
        "order_number",
    ];

    public function displayMenus()
    {
        // Cache key, unique per user
        $cacheKey = 'user_menus_' . auth()->id();

        // Check if menus are already stored in session
        if (session()->has($cacheKey)) {
            return session($cacheKey);
        }

        // Run the actual query (once)
        $menus = $this->where("is_parent", 1)
            ->with('childs.roles.role', 'roles.role')
            ->get();

        // Store in session
        session([$cacheKey => $menus]);

        return $menus;
        // return $this->where("is_parent",1)->with('childs.roles.role', 'roles.role')->get();
    }

    public function allMenuWithRole()
    {
        return $this->with('roles.role')->get();
    }

    public function parent()
    {
        return $this->belongsTo(Menu::class, "parent_id", "id");
    }

    public function childs()
    {
        return $this->hasMany(Menu::class, 'parent_id', 'id');
    }

    public function roles()
    {
        return $this->hasMany(RoleMenu::class, 'menu_id');
    }
}
