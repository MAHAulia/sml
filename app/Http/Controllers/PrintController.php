<?php

namespace App\Http\Controllers;

use App\Models\Manifest;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PrintController extends Controller
{
    public function printManifestSerah(String $code)
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
            return response()->json(['error' => 'Manifest not found or an error occurred.'], 404);
        }
    }
    
    public function printManifestTerima(String $code)
    {
        try {
            $manifest = Manifest::with([
                'creator',
                'receiver',
                'items',
            ])
                ->where('code', $code)
                ->firstOrFail();

            return Pdf::loadView('print.manifest-terima', [
                'manifest' => $manifest
            ])
                ->setPaper('a4', 'portrait')
                ->stream("manifest-terima-{$code}.pdf");
        } catch (\Exception $e) {
            return response()->json(['error' => 'Manifest not found or an error occurred.'], 404);
        }
    }
}
