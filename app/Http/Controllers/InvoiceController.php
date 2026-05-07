<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index() {
        $datas = Invoice::all();
        return Inertia::render('invoice/index', compact("datas"));
    }
}
