<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Offering;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PickupOfferingController extends Controller
{
    public function index() {
        $datas = Offering::where("status", "accepted")->where("user_id", Auth::id())->with("biaya", "customer")->latest()->get();
        
        return Inertia::render('offering-pickup/index', [
            "datas" => $datas,
            "customers" => []
        ]);
    }

    public function update(Request $request, $id) {
        $user = Auth::user();
        $offering = Offering::where('id', $id)
                                ->where("user_id", $user->id)
                                ->where("pickup_status", "null")
                                ->first();

        if (!$offering) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Penawaran Tidak Ditemukan',
                'message' => 'Data penawaran yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        $offering->pickup_status = "request";
        $offering->save();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Penawaran berhasil diperbaharui',
            'message' => 'Penawaran berhasil diperbaharui, silahkan hubungi customer service untuk mempercepat proses validasi.',
        ]);
    }
}
