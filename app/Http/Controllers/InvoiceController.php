<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Manifest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $datas = Invoice::with("mitra")->get();
        $customers = Customer::all();
        $data_invoices = [];
        $invoice_selecteds = [];
        if ($request->m) {
            $user = Auth::user();

            $invoice = Invoice::where('no_invoice', $request->m)->first();

            // ===============================
            // 1 & 2. Data yang SUDAH masuk ke invoice detail invoice ini
            // ===============================
            $invoice_selecteds = Transaction::with('biaya')
                ->where('office', $user->office)
                ->whereHas('invoiceDetails', function ($q) use ($invoice) {
                    $q->where('invoice_id', $invoice->id);
                })
                ->get();


            // ambil id transaction yang sudah ada di invoice ini
            $selectedData = $invoice_selecteds->pluck('id');


            // ===============================
            // 3. Data yang BELUM masuk ke invoice manapun
            // ===============================
            $data_invoices = Transaction::with('biaya')
                ->where('office', $user->office)
                ->whereDoesntHave('invoiceDetails')
                ->get();

            // dd($invoice_selecteds, $selectedData, $data_invoices);
        }
        return Inertia::render('invoice/index', compact("datas", "customers", "data_invoices", "invoice_selecteds"));
    }

    public function store(Request $request)
    {
        if ($request->action == "delete") {
            $latestInvoice = Invoice::where("no_invoice", $request->m)
                ->where("user_id", Auth::user()->id)
                ->latest()
                ->first();

            if (!$latestInvoice) {
                return redirect()->back()->with('flash', [
                    'type' => 'errorr',
                    'title' => "Invoice tidak ditemukan",
                    'message' => "Invoice dengan nomor $request->m tidak ditemukan",
                ]);
            }

            $latestInvoice->delete();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Invoice berhasil dihapus',
                'message' => "Invoice dengan nomor $request->m berhasil dihapus",
            ]);
        }

        if ($request->action == "update") {
            $isExist = Invoice::where("no_invoice", $request->noInvoice)
                ->latest()
                ->first();

            if ($isExist) {
                InvoiceDetail::where("invoice_id", $isExist->id)->delete();
                $total = 0;
                foreach ($request->selectedItem as $key => $value) {
                    InvoiceDetail::updateOrCreate(
                        [
                            'transaction_id' => $value, // kondisi pencarian
                            'invoice_id' => $isExist->id, // tambahkan bag_id sebagai kondisi pencarian
                            'user_id' => $isExist->id,
                            'customer_id' => $isExist->customer_id
                        ],
                        [
                            'invoice_id' => $isExist->id, // data yang diupdate / diinsert
                        ]
                    );
                }

                $total = Transaction::whereIn('id', $request->selectedItem)
                    ->whereHas('biaya')
                    ->with('biaya')
                    ->get()
                    ->sum(function ($item) {
                        return $item->biaya->deal_price ?? 0;
                    });

                $isExist->update([
                    'nominal' => $total
                ]);

                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data invoice berhasil disimpan',
                    'message' => 'Data invoice berhasil disimpan, silahkan lanjutkan proses berikutnya',
                ]);
            }
        }

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
        $invoiceNumber = 'INV-' . date("dmy") . str_pad($request->customerId, 4, '0', STR_PAD_LEFT) . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

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
