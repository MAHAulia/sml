<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', []);
    }

    public function termsAndConditions()
    {
        return Inertia::render('terms-and-conditions', []);
    }

    public function privacyPolicy()
    {
        return Inertia::render('privacy-policy', []);
    }
}
