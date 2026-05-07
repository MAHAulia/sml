<?php

use App\AiHelper\OpenRouterAI;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PickupOfferingController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\Form\FormController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\Langganan\LanggananController;
use App\Http\Controllers\ManifestController;
use App\Http\Controllers\ManifestSerahController;
use App\Http\Controllers\OfferingController;
use App\Http\Controllers\PickupController;
use App\Http\Controllers\PickupRequestController;
use App\Http\Controllers\Settings\MenuController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\SocialLogin\GoogleController;
use App\Http\Controllers\Support\SupportController;
use App\Http\Controllers\Tanggapan\TanggapanController;
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\WarehouseController;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Support\Facades\Route;

// Route::get('/', [LandingPageController::class, 'index'])->name('home');
Route::get('/', function () {
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

    Route::get("offering-request", [OfferingController::class, 'offeringRequest'])->name("offering-request.index");
    Route::put("offering-request/{id}", [OfferingController::class, 'offeringRequestUpdate'])->name("offering-price.store");

    Route::get("tarif", [OfferingController::class, 'tarif'])->name("tarif.index");
    Route::put("tarif/{id}", [OfferingController::class, 'storeTarif'])->name("tarif.create");

    Route::resource('pickup-offering', PickupOfferingController::class);

    Route::resource('pickup-request', PickupRequestController::class);
    Route::post('pickup-request/{id}', [PickupRequestController::class, 'savemanage'])->name('pickup-request.savemanage');

    Route::resource('pickup', PickupController::class);
    Route::get("pickup/manifest/serah", [PickupController::class, 'manifestSerah'])->name("pickup.manifest_serah");
    Route::post("pickup/manifest/serah/create", [PickupController::class, 'createManifestSerah'])->name("pickup.save_manifest_serah");
    Route::get("pickup/manifest/serah/show/{id}", [PickupController::class, 'showManifestSerah'])->name("pickup.show_manifest_serah");

    Route::resource('manifest', ManifestController::class);

    Route::resource('warehouse', WarehouseController::class);
    Route::get("warehouse/manifest/terima", [WarehouseController::class, 'manifestTerima'])->name("warehouse.manifest_terima");

    Route::post("warehouse/manifest/terima/create", [WarehouseController::class, 'createManifestTerima'])->name("warehouse.save_manifest_terima");

    Route::get("warehouse/bagging/create", [WarehouseController::class, 'baging'])->name("warehouse.baging");
    Route::post("warehouse/bagging/create", [WarehouseController::class, 'createBagging'])->name("warehouse.create_baging");

    Route::get("warehouse/manifest/serah", [WarehouseController::class, 'manifestSerah'])->name("warehouse.manifest_serah");
    Route::post("warehouse/manifest/serah/create", [WarehouseController::class, 'createManifestSerah'])->name("warehouse.save_manifest_serah");

    Route::resource('delivery', DeliveryController::class);
    Route::get("delivery/manifest/terima", [DeliveryController::class, 'manifestTerima'])->name("delivery.manifest_terima");
    Route::post("delivery/manifest/terima/create", [DeliveryController::class, 'createManifestTerima'])->name("delivery.save_manifest_terima");
    Route::get("delivery/order/data", [DeliveryController::class, 'deliveryOrder'])->name("delivery-order.index");
    Route::post("delivery/order/data", [DeliveryController::class, 'createDeliveryOrder'])->name("delivery-order.create");
    Route::get("delivery/antaran/status", [DeliveryController::class, 'deliveryAntaran'])->name("delivery-antaran.index");
    Route::post("delivery/antaran/status", [DeliveryController::class, 'deliveryAntaran'])->name("delivery-antaran.search");
    Route::post("delivery/antaran/show/{id}", [DeliveryController::class, 'updateDeliveryAntaran'])->name("delivery-antaran.update");

    Route::resource('invoice', InvoiceController::class);

});

Route::get('/mailable', function () {
    $user = App\Models\User::find(1);
    $raw_password = "19023123";

    return (new EmailVerificationNotification($raw_password))
        ->toMail($user);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
