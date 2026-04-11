import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import ConfirmationDialog from "@/components/confirm-dialog";
import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextArea } from "@/components/ui/textarea";
import { Offerings } from "@/types/marketing";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';


interface PickupFormDialog {
    selectedOffer: Offerings | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type PickupForm = {
    customerId: number | null;
    pickuperId: number | null;
    pickuperName: string;
    pickuperEmail: string;
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    p: number;
    l: number;
    t: number;
    jumlah: number;
    berat: number;
    isiKiriman: string;
    catatan: string;
    basePrice: number;
    offeringPrice: number;
    dealPrice: number;
    negoPrice: number;
    status: string;
    action: string;
};


export default function PickupDialog({ selectedOffer, isOpen, setIsOpen, isView = true }: PickupFormDialog) {

    const { data, setData, put, processing, errors, reset } = useForm<Required<PickupForm>>({
        customerId: null,
        pickuperId: null,
        pickuperName: "",
        pickuperEmail: "",
        senderName: "",
        senderAddress: "",
        senderPhone: "",
        receiverName: "",
        receiverAddress: "",
        receiverPhone: "",
        p: 0,
        l: 0,
        t: 0,
        jumlah: 0,
        berat: 0,
        isiKiriman: "",
        catatan: "",
        basePrice: 0,
        offeringPrice: 0,
        dealPrice: 0,
        negoPrice: 0,
        status: "",
        action: 'add',
    });

    const [confirmIsShow, setConfirmIsShow] = useState(false)
    const [confirmation, setConfirmation] = useState({
        title: "",
        subtitle: "",
        message: "",
        label: "",
    })

    useEffect(() => {

        if (selectedOffer != null) {
            setData("status", "on_pickup");
            setData('customerId', selectedOffer.customer_id);
            setData('senderName', selectedOffer.senderName);
            setData('senderAddress', selectedOffer.senderAddress);
            setData('senderPhone', selectedOffer.senderPhone);
            setData('receiverName', selectedOffer.receiverName);
            setData('receiverAddress', selectedOffer.receiverAddress);
            setData('receiverPhone', selectedOffer.receiverPhone);
            setData('p', selectedOffer.p);
            setData('l', selectedOffer.l);
            setData('t', selectedOffer.t);
            setData('berat', selectedOffer.weight);
            setData('isiKiriman', selectedOffer.isiKiriman);
            setData('catatan', selectedOffer.catatan ?? "");
            setData('jumlah', selectedOffer.total_item);
            setData('basePrice', selectedOffer.biaya?.base_price ?? 0);
            setData('offeringPrice', selectedOffer.biaya?.offering_price ?? 0);
            setData('dealPrice', selectedOffer.biaya?.deal_price ?? 0);
            setData('negoPrice', selectedOffer.biaya?.nego_price ?? 0);
            setData('action', 'update');
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOffer]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data)
        setConfirmation({
            title: "Update Status Pickup",
            subtitle: "Perbaharui status pickup kiriman",
            message: "Apakah Anda yakin proses pickup sudah selesai dilakukan?",
            label: "Ya, sudah selesai"
        })
        setConfirmIsShow(true)
    };

    const updateStatusFinish = () => {
        console.log(data)
        put(route('pickup.update', selectedOffer?.id), {
            onSuccess: () => {
                resetForm();
                if (setIsOpen) {
                    setIsOpen(false);
                }
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }

    const resetForm = () => {
        reset('customerId');
        reset('senderName');
        reset('senderAddress');
        reset('senderPhone');
        reset('receiverName');
        reset('receiverPhone');
        reset('receiverAddress');
        reset('berat');
        reset('p');
        reset('l');
        reset('t');
        reset('isiKiriman');
        reset('jumlah');
        reset('catatan');
        reset('basePrice');
        reset('offeringPrice');
        reset('dealPrice');
        reset('negoPrice');
        reset('action');
    };

    const getVariant = (status: string | undefined) => {
        let variant = "default"
        switch (status) {
            case 'pending':
                variant = "secondary"
                break;
            case 'on_review':
                variant = "destructive"
                break;
            case 'price_set':
                variant = "outline"
                break;
            case 'on_nego':
                variant = "ghost"
                break;
            case 'accepted':
                variant = "link"
                break;
            case 'rejected':
                variant = "destructive"
                break;

            default:
                variant = "default"
                break;
        }

        return variant as "default" | "secondary" | "destructive" | "outline" | null | undefined
    }

    const getLabel = (status: string | undefined) => {
        let label = status
        switch (status) {
            case 'pending':
                label = "Sedang Diproses"
                break;
            case 'on_review':
                label = "Sedang Ditinjau"
                break;
            case 'price_set':
                label = "Biaya Ditetapkan"
                break;
            case 'on_nego':
                label = "Dalam Negosiasi"
                break;
            case 'accepted':
                label = "Transaksi Diterima"
                break;
            case 'rejected':
                label = "Transaksi Ditolak"
                break;
            case 'success_pickup':
                label = "Pickup Berhasil"
                break;
            case 'null':
                label = "Need Pickup"
                break;
            case 'request':
                label = "Permintaan Pickup"
                break;
            case 'on_pickup':
                label = "Sedang Proses Pickup"
                break;
            case 'failed_pickup':
                label = "Pickup Gagal"
                break;
            default:
                label = "Sedang Diproses"
                break;
        }

        return label
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-9/12">
                    <DialogHeader>
                        <DialogTitle>Set Pickuper &nbsp; {isView && <Badge variant={getVariant(selectedOffer?.pickup_status)}>{getLabel(selectedOffer?.pickup_status)}</Badge>}</DialogTitle>
                        <DialogDescription>
                            Kelola taif untuk penawaran layanan pengiriman dokumen
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div>
                            <form className="flex flex-col gap-6" onSubmit={submit}>
                                <div className="grid gap-6">

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="grid gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="senderName">Nama Pengirim</Label>
                                                <Input
                                                    id="senderName"
                                                    type="text"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="senderName"
                                                    value={data.senderName}
                                                    placeholder="contoh. Fulan bin Fulan"
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.senderName} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="senderPhone">Telepon Pengirim</Label>
                                                <Input
                                                    id="senderPhone"
                                                    type="tel"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="senderPhone"
                                                    maxLength={15}
                                                    value={data.senderPhone}
                                                    placeholder="contoh. 08123456789"
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.senderPhone} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="senderAddress">Alamat Pengirim</Label>
                                                <TextArea
                                                    id="senderAddress"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="senderAddress"
                                                    value={data.senderAddress}
                                                    placeholder="contoh. Jl. Sumatra No. 123"
                                                    disabled={isView}
                                                    readOnly
                                                    className="h-24"
                                                />
                                                <InputError message={errors.senderAddress} />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="receiverName">Nama Penerima</Label>
                                                <Input
                                                    id="receiverName"
                                                    type="text"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="receiverName"
                                                    value={data.receiverName}
                                                    placeholder="contoh. Rozi"
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.receiverName} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="receiverPhone">Telepon Penerima</Label>
                                                <Input
                                                    id="receiverPhone"
                                                    type="tel"
                                                    required
                                                    tabIndex={5}
                                                    autoComplete="receiverPhone"
                                                    value={data.receiverPhone}
                                                    placeholder="contoh. 08123456789"
                                                    maxLength={15}
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.receiverPhone} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="receiverAddress">Alamat Penerima</Label>
                                                <TextArea
                                                    id="receiverAddress"
                                                    required
                                                    tabIndex={6}
                                                    autoComplete="receiverAddress"
                                                    value={data.receiverAddress}
                                                    placeholder="contoh. Jl. Aceh No. 123"
                                                    disabled={isView}
                                                    readOnly
                                                    className="h-24"
                                                />
                                                <InputError message={errors.receiverAddress} />
                                            </div>

                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="isiKiriman">Isi Kiriman</Label>
                                                <Input
                                                    id="isiKiriman"
                                                    type="text"
                                                    required
                                                    tabIndex={7}
                                                    autoComplete="isiKiriman"
                                                    value={data.isiKiriman}
                                                    placeholder="contoh. Buku Cetak"
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.isiKiriman} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="catatan">Catatan</Label>
                                                <TextArea
                                                    id="catatan"
                                                    tabIndex={8}
                                                    autoComplete="catatan"
                                                    value={data.catatan}
                                                    placeholder="contoh. Tolong ditangani dengan baik"
                                                    disabled={isView}
                                                    readOnly
                                                    className="h-40"
                                                />
                                                <InputError message={errors.catatan} />
                                            </div>

                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="jumlah">Jumlah Barang (pcs)</Label>
                                                <Input
                                                    id="jumlah"
                                                    type="number"
                                                    required
                                                    tabIndex={9}
                                                    autoComplete="jumlah"
                                                    value={data.jumlah}
                                                    placeholder="contoh. 2"
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.jumlah} />
                                            </div>


                                            <div className="grid gap-2">
                                                <Label htmlFor="dimension">Dimensi Barang (cm)</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <Input
                                                        id="p"
                                                        type="number"
                                                        tabIndex={10}
                                                        step="any"
                                                        inputMode="decimal"
                                                        autoComplete="off"
                                                        value={data.p}
                                                        placeholder="Panjang"
                                                        disabled={isView}
                                                        readOnly
                                                    />
                                                    <InputError message={errors.p} />
                                                    <Input
                                                        id="l"
                                                        type="number"
                                                        required
                                                        tabIndex={11}
                                                        autoComplete="l"
                                                        value={data.l}
                                                        placeholder="Lebar"
                                                        disabled={isView}
                                                        readOnly
                                                    />
                                                    <InputError message={errors.l} />
                                                    <Input
                                                        id="t"
                                                        type="number"
                                                        required
                                                        tabIndex={12}
                                                        autoComplete="t"
                                                        value={data.t}
                                                        placeholder="Tinggi"
                                                        disabled={isView}
                                                        readOnly
                                                    />
                                                    <InputError message={errors.t} />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="berat">Berat (gram)</Label>
                                                <Input
                                                    id="berat"
                                                    type="number"
                                                    required
                                                    tabIndex={13}
                                                    step="any"
                                                    inputMode="decimal"
                                                    autoComplete="off"
                                                    value={data.berat}
                                                    placeholder="contoh. 12.5"
                                                    disabled={isView}
                                                    readOnly
                                                />
                                                <InputError message={errors.berat} />
                                            </div>
                                        </div>

                                    </div>


                                    <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Pickup Selesai
                                    </Button>
                                </div>

                            </form>

                            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                title={confirmation.title}
                subtitle={confirmation.subtitle}
                message={confirmation.message}
                isOpen={confirmIsShow}
                isLoading={processing}
                onOpenChange={setConfirmIsShow}
                label={confirmation.label}
                onConfirm={updateStatusFinish} />
        </>

    )
}