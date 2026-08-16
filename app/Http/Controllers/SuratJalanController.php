<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SuratJalanController extends Controller
{
    public function index()
    {
        return Inertia::render('surat-jalan/index');
    }
}
