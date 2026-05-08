<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $datas = Invoice::with("mitra")->get();
        $customers = Customer::all();
        return Inertia::render('invoice/index', compact("datas", "customers"));
    }

    public function store(Request $request)
    {
        if ($request->action == "add") {
            $latestInvoice = Invoice::where("customer_id", $request->customerId)
                ->latest()
                ->first();

            if ($latestInvoice) {
                // Get number from INV-0001
                $lastNumber = (int) str_replace('INV-', '', $latestInvoice->no_invoice);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            // Format invoice number
            $invoiceNumber = 'INV-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            Invoice::insert([
                "user_id" => Auth::user()->id,
                "customer_id" => $request->customerId,
                "no_invoice" => $invoiceNumber,
                "nominal" => 0,
            ]);

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Invoice berhasil dibuat',
                'message' => 'Invoice berhasil dibuat dengan nomor ' . $invoiceNumber,
            ]);
        }
    }
}
