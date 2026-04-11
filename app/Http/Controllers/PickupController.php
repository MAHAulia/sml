<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Kantor;
use App\Models\Manifest;
use App\Models\Offering;
use App\Models\Role;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PickupController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $datas = Offering::where("status", "accepted")
            ->where("pickuper_id", $user->id)
            ->with("biaya", "customer")
            ->latest()->get();

        return Inertia::render('pickup/index', [
            "datas" => $datas,
            "pickuper" => []
        ]);
    }
    public function update(Request $request, $id)
    {
        $offering = Offering::where('id', $id)
            ->where("pickup_status", "on_pickup")
            ->first();

        if (!$offering) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Pickup Tidak Ditemukan',
                'message' => 'Data pickup yang akan Anda ubah tidak dapat ditemukan',
            ]);
        }

        try {
            DB::beginTransaction();

            $lastOrder = Transaction::where("customer_id", $offering->customer_id)->latest()->first();
            $orderNumber = 1;
            if ($lastOrder) {
                $orderNumber = (int)substr($orderNumber, 11) + 1;
            }

            $baseNumber = date("Ymd") . str_pad($orderNumber, "5", "0", STR_PAD_LEFT) . $offering->customer_id;
            $luhnDigit = $this->generateLuhnDigit($baseNumber);
            $orderNumber = "CNB" . $baseNumber . $luhnDigit;

            $offering->pickup_status = "success_pickup";
            $offering->save();

            $data = $offering;
            $data->offering_id = $offering->id;
            $data->order_number = $orderNumber;
            unset($data->created_at);
            unset($data->updated_at);
            Transaction::insert($data->toArray());

            // Send Email To Customer

            DB::commit();
            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Status pickup berhasil diperbaharui',
                'message' => 'Status pickup berhasil diperbaharui, silahkan hubungi customer service untuk mempercepat proses validasi.',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Update status pickup gagal',
                'message' => 'Gagal update status pickup ' . $th->getMessage(),
            ]);
        }
    }

    public function manifestSerah()
    {
        $user = Auth::user();
        $datas = Manifest::where("user_id", $user->id)->latest()->get();
        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Delivery", "Warehouse"])->get();

        return Inertia::render('manifest-serah/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
        ]);
    }

    public function createManifestSerah(Request $request)
    {  
        $user = Auth::user();
        $role = $user->roles()->first();
        $isExist = Manifest::where("user_id", $user->id)
            ->where("office_to", $request->type == "local" ? $user->office : $request->office_to)
            ->where("to", $request->to)
            ->where("type", $request->type)
            ->first();

        if ($isExist) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Manifest Sebelumnya Sudah Dibuat',
                'message' => 'Manifest untuk tujuan ini sudah dibuat sebelumnya.',
            ]);
        }

        $manifest = new Manifest();
        $manifest->code = "MNF" . $user->id . date("YmdHis");
        $manifest->user_id = $user->id;
        $manifest->from = $role->name ?? "";
        $manifest->office_from = $user->office;
        $manifest->office_to = $request->type == "local" ? $user->office : $request->office_to;
        $manifest->to = $request->to;
        $manifest->type = $request->type;
        $manifest->status = "created";
        $manifest->save();

        return redirect()->route("pickup.manifest_serah");
    }
}
