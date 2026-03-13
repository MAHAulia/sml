<?php

namespace App\Http\Controllers;

use App\Models\Offering;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PickupController extends Controller
{
    public function index() {
        $user = Auth::user();
        $datas = Offering::where("status", "accepted")
                        ->where("pickuper_id", $user->id)
                        ->with("biaya", "customer")
                        ->latest()->get();
        
        return Inertia::render('pickup/index', [
            "datas" => $datas,
            "pickuper" => []
        ]);
    }

    public function update(Request $request, $id) {
        $offering = Offering::where('id', $id)
                                ->where("pickup_status", "on_pickup")
                                ->first();

        if (!$offering) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Pickup Tidak Ditemukan',
                'message' => 'Data pickup yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        $offering->pickup_status = "success_pickup";
        $offering->save();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Status pickup berhasil diperbaharui',
            'message' => 'Status pickup berhasil diperbaharui, silahkan hubungi customer service untuk mempercepat proses validasi.',
        ]);
    }
}
