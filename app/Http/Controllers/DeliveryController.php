<?php

namespace App\Http\Controllers;

use App\Models\Bag;
use App\Models\BagDetail;
use App\Models\DeliveryOrder;
use App\Models\DeliveryOrderDetail;
use App\Models\Kantor;
use App\Models\Manifest;
use App\Models\ManifestDetail;
use App\Models\Role;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index()
    {
        return Inertia::render('delivery/index');
    }

    public function manifestTerima(Request $request)
    {
        $user = Auth::user();
        $role = $user->roles()->first();
        $datas = Manifest::where("to", $role->name)
            ->where("office_to", $user->office)
            ->with("items")
            ->latest()
            ->get();
        // dd($datas);
        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Pickup", "Delivery", "Warehouse"])->get();
        if ($request->t == "local") {
            $manifest = Manifest::where("code", $request->m)->first();

            $dataManifest = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest->id);

            if ($request->v != "T") {
                $dataManifest->where('manifest_details.status', 'created');
            }

            $dataManifest = $dataManifest->select('transactions.*')
                ->get();
            $dataSelected = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest->id)
                ->where('manifest_details.status', 'received')
                ->select('transactions.*')
                ->get();
        } else if ($request->t == "linehaul") {
            $manifest = Manifest::where("code", $request->m)->first();

            // Data yang BELUM masuk manifest manapun
            $dataManifest = Bag::select('bags.*')
                ->leftJoin('manifest_details', 'bags.id', '=', 'manifest_details.item_id')
                // ->whereNull('manifest_details.item_id')
                // ->where('bags.office', $user->office)
                ->where("manifest_details.manifest_id", "=", $manifest?->id)
                ->where('bags.status', 'manifested')
                ->get();

            // Data yang SUDAH masuk manifest tertentu
            $dataSelected = Bag::select('bags.*')
                ->join('manifest_details', 'bags.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest?->id)
                // ->where('bags.office', $user->office)
                ->where('bags.status', 'received')
                ->get();

            // dd($dataManifest, $dataSelected);
        } else {
            $dataManifest = [];
            $dataSelected = [];
        }

        return Inertia::render('manifest-terima/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
            "data_manifest" => $dataManifest,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createManifestTerima(Request $request)
    {

        if ($request->a == 'approval') {

            $manifest = Manifest::where("code", $request->m)->first();
            if (!$manifest) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Tidak Ditemukan',
                    'message' => 'Data manifest yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($manifest->status != "send") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Sudah Memiliki Status',
                    'message' => 'Saat ini manifest ' . $request->m . ' sudah memiliki status ' . strtoupper($manifest->status) . ".",
                ]);
            }

            ManifestDetail::whereNotIn("item_id", $request->selectedItem)
                ->where("manifest_id", $manifest->id)
                ->update(["status" => "created"]);

            ManifestDetail::whereIn("item_id", $request->selectedItem)
                ->where("manifest_id", $manifest->id)
                ->update(["status" => "received"]);

            if (count($request->items) == 0) {
                $manifest->status = "received";
                $manifest->save();
            }

            if ($manifest->type == 'linehaul') {
                $manifestDetail = ManifestDetail::where("manifest_id", $manifest->id)->get();
                foreach ($manifestDetail as $value) {
                    // Update bag
                    $bag = Bag::where("id", $value->item_id)->first();
                    if ($bag) {
                        $bag->status = "received";
                        $bag->save();

                        BagDetail::where("bag_id", $bag->id)
                            ->update(["status" => "received"]);
                    }
                }
            }

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data manifest berhasil disimpan',
                'message' => 'Data manifest berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);
        }

        return redirect()->route("warehouse.manifest_terima");
    }

    public function deliveryOrder(Request $request)
    {
        $user = Auth::user();
        $datas = DeliveryOrder::where("user_id", $user->id)
            ->with("items")
            ->latest()
            ->get();

        $dataDo = [];
        $dataSelected = [];
        if ($request->m) {
            $deliveryOrder = DeliveryOrder::where("code", $request->m)->first();
            $dataSelected = Transaction::join('delivery_order_details', 'transactions.id', '=', 'delivery_order_details.transaction_id')
                ->where('delivery_order_details.delivery_order_id', $deliveryOrder?->id)
                ->select('transactions.*')
                ->get();
            $dataDo = Transaction::leftJoin('delivery_order_details', 'transactions.id', '=', 'delivery_order_details.transaction_id')
                ->whereNull('delivery_order_details.transaction_id')
                ->select('transactions.*')
                ->get();
            // dd($dataDo, $dataSelected);
        }

        return Inertia::render('delivery-order/index', [
            "datas" => $datas,
            "data_manifest" => $dataDo,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createDeliveryOrder(Request $request)
    {

        $user = Auth::user();

        if ($request->a == 'delete') {
            $do = DeliveryOrder::where("code", $request->m)->first();
            if (!$do) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Delivery Order Tidak Ditemukan',
                    'message' => 'Data delivery order yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($do->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Delivery Order Sudah Memiliki Status',
                    'message' => 'Saat ini Delivery Order ' . $request->m . ' sudah memiliki status ' . strtoupper($do->status) . ".",
                ]);
            }

            $do->delete();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data delivery order berhasil dihapus',
                'message' => 'Data delivery order berhasil dihapus',
            ]);
        }

        if ($request->a == 'approval') {
            $do = DeliveryOrder::where("code", $request->m)->first();
            if (!$do) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Delivery Order Tidak Ditemukan',
                    'message' => 'Data delivery order yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($do->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Delivery Order Sudah Memiliki Status',
                    'message' => 'Saat ini delivery order ' . $request->m . ' sudah memiliki status ' . strtoupper($do->status) . ".",
                ]);
            }

            $do->status = "open";
            $do->save();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data delivery order berhasil disimpan',
                'message' => 'Data delivery order berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);
        }

        $isExist = DeliveryOrder::where("user_id", $user->id)
            ->where("status", "created")
            ->first();

        if ($isExist) {
            if (!$request->code) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Delivery Order Sebelumnya Sudah Dibuat',
                    'message' => 'Delivery order untuk tujuan ini sudah dibuat sebelumnya.',
                ]);
            } else {
                if (count($request->selectedItem) == 0) {
                    DeliveryOrderDetail::where("delivery_order_id", $isExist->id)->delete();
                } else {
                    foreach ($request->selectedItem as $key => $value) {
                        DeliveryOrderDetail::updateOrCreate(
                            [
                                'transaction_id' => $value, // kondisi pencarian
                            ],
                            [
                                'delivery_order_id' => $isExist->id, // data yang diupdate / diinsert
                            ]
                        );
                    }
                }

                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data delivery order berhasil disimpan',
                    'message' => 'Data delivery order berhasil disimpan, silahkan lanjutkan proses berikutnya',
                ]);
            }
        } else {
            $do = new DeliveryOrder();
            $do->code = "DO" . $user->id . date("YmdHis");
            $do->user_id = $user->id;
            $do->status = "created";
            $do->save();
        }

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Delivery order berhasil dibuat',
            'message' => 'Delivery order berhasil dibuat, silahkan lanjutkan proses berikutnya',
        ]);
    }

    public function deliveryAntaran(Request $request)
    {
        if ($request->code) {
            $data = Transaction::leftJoin('delivery_order_details', 'transactions.id', '=', 'delivery_order_details.transaction_id')
                ->where('transactions.order_number', $request->code)
                ->select('transactions.*')
                ->first();

            // add image url
            if ($data && $data->bukti) {
                $data->bukti_url = asset('storage/' . $data->bukti);
            } else {
                $data->bukti_url = null;
            }
        }
        return Inertia::render('delivery-antaran/index', [
            "data" => $data ?? [],
        ]);
    }

    public function updateDeliveryAntaran(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
            'reason' => 'nullable|string',
            'bukti' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $transaction = Transaction::where("id", $id)->first();

        if (!$transaction) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'title' => 'Data Transaksi Tidak Ditemukan',
                'message' => 'Data transaksi tidak ditemukan.',
            ]);
        }

        $transaction->delivery_status = $request->status;
        $transaction->reason = $request->reason;
        $transaction->latitude = $request->latitude;
        $transaction->longitude = $request->longitude;

        // Upload bukti image
        if ($request->hasFile('bukti')) {

            // delete old file if exists
            if ($transaction->bukti) {
                Storage::disk('public')->delete($transaction->bukti);
            }

            $file = $request->file('bukti');

            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs(
                'delivery-bukti',
                $filename,
                'public'
            );

            $transaction->bukti = $path;
        }

        $transaction->save();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'title' => 'Status antaran berhasil diupdate',
            'message' => 'Status antaran berhasil diupdate.',
        ]);
    }
}
