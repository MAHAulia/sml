<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('customers/index', [
            "datas" => Customer::all(["id", "name", "email", "phone", "address"])
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
            "name" => "required|max:100",
            "phone" => "required|unique:customers|max:15",
            "email" => "required|unique:customers|max:100",
            "address" => "required|max:250",
        ]);

        Customer::create([
            "name" => $request->email,
            "email" => $request->email,
            "phone" => $request->phone,
            "address" => $request->address,
        ]);

        return to_route("customer.index")->with('flash', [
            'type' => 'success',
            'title' => 'Penambahan Data Customer Berhasil',
            'message' => 'Data Customer baru berhasil ditambahkan.',
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
        $customer = Customer::where('id', $id)->first();
        if (!$customer) {
            return to_route("customer.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Customer Gagal',
                'message' => 'Data customer tidak ditemukan.',
            ]);
        }

        $customer->name = $request->name;
        $customer->email = $request->email;
        $customer->phone = $request->phone;
        $customer->address = $request->address;
        $customer->save();

        return to_route("customer.index")->with('flash', [
            'type' => 'success',
            'title' => 'Pembaharuan Data Customer Berhasil',
            'message' => 'Data customer terlah berhasil diperbaharui.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::where('id', $id)->first();
        if (!$customer) {
            return to_route("customer.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Customer Gagal',
                'message' => 'Data customer tidak ditemukan.',
            ]);
        }

        $customer->delete();

        return to_route("customer.index")->with('flash', [
            'type' => 'success',
            'title' => 'Berhasil Hapus Customer',
            'message' => 'Data customer berhasil dihapus.',
        ]);
    }
}
