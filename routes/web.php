<?php

use App\AiHelper\OpenRouterAI;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Form\FormController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Langganan\LanggananController;
use App\Http\Controllers\OfferingController;
use App\Http\Controllers\Settings\MenuController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\SocialLogin\GoogleController;
use App\Http\Controllers\Support\SupportController;
use App\Http\Controllers\Tanggapan\TanggapanController;
use App\Http\Controllers\Users\UserController;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Support\Facades\Route;

// Route::get('/', [LandingPageController::class, 'index'])->name('home');
Route::get('/', function() {
    return redirect()->route("login");
})->name('home');
Route::get('/syarat-dan-ketentuan', [LandingPageController::class, 'termsAndConditions'])->name('termsAndConditions');
Route::get('/kebijakan-privasi', [LandingPageController::class, 'privacyPolicy'])->name('privacyPolicy');

Route::get('pengguna/{id}/{hash}', [UserController::class, 'verify'])->name('pengguna.verify');

Route::middleware(['auth', 'verified', 'routeaccess'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource("pengguna", UserController::class)->except(["create", "show", "edit"]);
    Route::put('pengguna/verify-resend/{id}', [UserController::class, 'resendVerify'])->name('pengguna.verify-resend');

    Route::resource("menu", MenuController::class);

    Route::resource("role", RoleController::class);
    Route::get("role/mapping/{role}", [RoleController::class, "roleMapping"])->name("role.mappingmenutorole");
    Route::put("role/mapping/{role}", [RoleController::class, "updateRoleMapping"])->name("role.storemappingmenutorole");

    Route::resource('customer', CustomerController::class);
    Route::resource("offering", OfferingController::class);
    
});

Route::get('/mailable', function () {
    $user = App\Models\User::find(1);
    $raw_password = "19023123";

    return (new EmailVerificationNotification($raw_password))
        ->toMail($user);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
