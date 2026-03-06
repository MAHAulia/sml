<?php

namespace App\Http\Controllers;

use App\Models\Biaya;
use App\Models\Customer;
use App\Models\Offering;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OfferingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $datas = Offering::where("user_id", Auth::id())->with("biaya", "customer")->latest()->get();
        
        return Inertia::render('offering/index', [
            "datas" => $datas,
            "customers" => Customer::all(["id", "name", "phone","email", "address"])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "senderName" => "required|string|max:100",
            "senderAddress" => "required|string|max:255",
            "senderPhone" => "required|string|max:15",
            "receiverName" => "required|string|max:100",
            "receiverAddress" => "required|string|max:255",
            "receiverPhone" => "required|string|max:15",
            "jumlah" => "required|numeric|min:1",
            "berat" => "required|numeric|min:0.01",
            "isiKiriman" => "required|string|max:255",
        ]);

        $user = Auth::user();

        Offering::create([
            "user_id" => $user->id,
            "customer_id" => $request->customerId,
            "senderName" => $request->senderName,
            "senderPhone" => $request->senderPhone,
            "senderAddress" => $request->senderAddress,
            "receiverName" => $request->receiverName,
            "receiverPhone" => $request->receiverPhone,
            "receiverAddress" => $request->receiverAddress,
            "total_item" => $request->jumlah,
            "p" => $request->p,
            "l" => $request->l,
            "t" => $request->t,
            "weight" => $request->berat,
            "isiKiriman" => $request->isiKiriman,
            "catatan" => $request->catatan,
        ]);

        return to_route("offering.index")->with('flash', [
            'type' => 'success',
            'title' => 'Penawaran berhasil dibuat',
            'message' => 'Penawaran berhasil dibuat, silahkan hubungi customer service untuk mempercepat proses validasi.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $offering = Offering::where('id', $id)
                                ->where("user_id", $user->id)
                                ->where("status", "pending")
                                ->first();
        if (!$offering) {
            return to_route("offering.index")->with('flash', [
                'type' => 'error',
                'title' => 'Data Penawaran Tidak Ditemukan',
                'message' => 'Data penawaran yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        $offering->user_id = $user->id;
        $offering->customer_id = $request->customerId;
        $offering->senderName = $request->senderName;
        $offering->senderPhone = $request->senderPhone;
        $offering->senderAddress = $request->senderAddress;
        $offering->receiverName = $request->receiverName;
        $offering->receiverPhone = $request->receiverPhone;
        $offering->receiverAddress = $request->receiverAddress;
        $offering->total_item = $request->jumlah;
        $offering->p = $request->p;
        $offering->l = $request->l;
        $offering->t = $request->t;
        $offering->weight = $request->berat;
        $offering->isiKiriman = $request->isiKiriman;
        $offering->catatan = $request->catatan;
        $offering->save();

        return to_route("offering.index")->with('flash', [
            'type' => 'success',
            'title' => 'Penawaran berhasil diperbaharui',
            'message' => 'Penawaran berhasil diperbaharui, silahkan hubungi customer service untuk mempercepat proses validasi.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function offeringRequest() {
        $datas = Offering::with("biaya", "customer")->latest()->get();
        
        return Inertia::render('offering-request/index', [
            "datas" => $datas,
            "customers" => Customer::all(["id", "name", "phone","email", "address"])
        ]);
    }
    
    public function offeringRequestUpdate(Request $request, $id)
    {
        $user = Auth::user();
        $offering = Offering::where('id', $id)
                                ->where("status", "pending");

        if ($user->hasRole('Marketing')) {
            $offering->where("user_id", $user->id);
        }

        $offering = $offering->first();

        if (!$offering) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Penawaran Tidak Ditemukan',
                'message' => 'Data penawaran yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        $offering->status = "on_review";
        $offering->save();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Penawaran sedang dalam proses review dan penentuan harga',
            'message' => 'Penawaran sedang dalam proses review dan penentuan harga oleh team financing',
        ]);
    }

    public function tarif() {
        $datas = Offering::with("biaya", "customer")->latest()->get();

        return Inertia::render('tarif/index', [
            "datas" => $datas,
            "customers" => Customer::all(["id", "name", "phone","email", "address"])
        ]);
    }

    public function storeTarif(Request $request, string $id) {

    
        if ($request->state) {
            $offering = Offering::where('id', $id)
                                ->whereIn("status", ["on_review_nego", "rejected"])
                                ->with('biaya')
                                ->first();
        } else {
            $offering = Offering::where('id', $id)
                                ->whereIn("status", ["on_review", "price_set", "on_nego", "rejected"])
                                ->with('biaya')
                                ->first();
        }
        
        if (!$offering) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Penawaran Tidak Ditemukan',
                'message' => 'Data penawaran yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        
        $user = Auth::user();
        $status = $request->status ?? "pending"; // ["pending", "on_nego", "accepted", "rejected"]

        if ($request->state) {
            $status = $request->state == "approve" ? "accepted": "rejected";
        }

        $data = [
            'user_id'        => $user->id,
            'base_price'     => $request->basePrice,
            'offering_price' => $request->offeringPrice,
            'deal_price'     => $request->dealPrice,
            'nego_price'     => $request->negoPrice,
            'status'         => $status
        ];

        if ($user->hasRole('Marketing')) {
            $status = "on_nego";
            unset($data["deal_price"]);
            unset($data["base_price"]);
            unset($data["offering_price"]);
        } else if ($user->hasRole('Customer Services')) {
            $status = "on_review_nego";
            $data["status"] = "on_review_nego";
            unset($data["deal_price"]);
            unset($data["base_price"]);
            unset($data["offering_price"]);
            unset($data["nego_price"]);
        }
        
        if ($request->state) {
            $offering->biaya()->update([
                "status" => $status
            ]);
        } else {
            $offering->biaya()->updateOrCreate(
                ['offering_id' => $offering->id], // condition
                $data
            );
        }
        

        $offering->update([
            "status" => $status == "pending" ? "price_set" : $status
        ]);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Tarif berhasil disimpan',
            'message' => 'Penawaran tarif berhasil disimpan',
        ]);
    }
}
