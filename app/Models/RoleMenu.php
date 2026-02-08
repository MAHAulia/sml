<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleMenu extends Model
{
    protected $fillable = [
        'role_id',
        'menu_id',
    ];
    
    public function role() {
        return $this->belongsTo(Role::class, "role_id", "id");
    }

    public function menu() {
        return $this->belongsTo(Menu::class, "menu_id", "id");
    }
}
