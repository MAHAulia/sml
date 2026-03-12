<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Offering;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PickupRequestController extends Controller
{
    public function index() {
        $datas = Offering::where("status", "accepted")
                        ->whereIn("pickup_status", ["null","request", "on_pickup", "success_pickup", "failed_pickup"])
                        ->with("biaya", "customer")
                        ->latest()->get();


        $pickuper = User::whereHas('roles', function($q) {
            return $q->where('name', 'Pick Up');
        })
        ->where("email", "!=", "super-admin@email.com")
        ->whereDoesntHave('pickups', function ($q) {
            $q->whereDate('created_at', today())
            ->whereIn('pickup_status', ['request', 'on_pickup']);
        })
        ->get();
        
        return Inertia::render('pickup-request/index', [
            "datas" => $datas,
            "pickuper" => $pickuper
        ]);
    }

    public function savemanage(Request $request, $id) {
        $offering = Offering::where('id', $id)
                                ->where("pickup_status", "request")
                                ->first();

        if (!$offering) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Penawaran Tidak Ditemukan',
                'message' => 'Data penawaran yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        $offering->pickuper_id = $request->pickuperId;
        $offering->pickup_status = "on_pickup";
        $offering->save();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Petugas pickup berhasil disimpan',
            'message' => 'Petugas pickup berhasil disimpan, silahkan hubungi customer service untuk mempercepat proses validasi.',
        ]);
    }
}
