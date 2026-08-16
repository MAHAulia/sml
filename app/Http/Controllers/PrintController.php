<?php

namespace App\Http\Controllers;

use App\Models\Bag;
use App\Models\Manifest;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class PrintController extends Controller
{
    public function printManifest(String $code)
    {
        try {
            $manifest = Manifest::with([
                'creator',
                'receiver',
                'items',
            ])
                ->where('code', $code)
                ->firstOrFail();

            return Pdf::loadView('print.manifest', [
                'manifest' => $manifest
            ])
                ->setPaper('a4', 'portrait')
                ->stream("manifest-{$code}.pdf");
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Manifest not found or an error occurred.'], 404);
        }
    }

    public function printBag(String $code)
    {
        try {
            $bag = Bag::with([
                'creator',
                'items.item',
            ])
                ->where('code', $code)
                ->firstOrFail();
            return Pdf::loadView('print.bag', [
                'bag' => $bag
            ])
                ->setPaper('a4', 'portrait')
                ->stream("manifest-{$code}.pdf");
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Bag not found or an error occurred.'], 404);
        }
    }
    
}
