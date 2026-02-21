<?php

namespace App\Http\Controllers;

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
        
        return Inertia::render('offering/index', [
            "datas" => [],
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
