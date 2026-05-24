import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextArea } from "@/components/ui/textarea";
import { CustomerData } from "@/types/customer";
import { Offerings } from "@/types/marketing";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';


interface OfferingFormDialog {
    selectedOffer: Offerings | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    confirmApprove: (selectedOffer: Offerings | null) => void;
    confirmReject: (selectedOffer: Offerings | null) => void;
    isView: boolean;
}

type OfferingForm = {
    customerId: number | null;
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


export default function TarifDialog({ selectedOffer, isOpen, setIsOpen, isView = true, confirmApprove, confirmReject  }: OfferingFormDialog) {
    const [selectIsOpen, setSelectIsOpen] = useState(false)
    const page = usePage();
    const customers = page.props.customers as CustomerData[];
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<OfferingForm>>({
        customerId: null,
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
        status: "pending",
        action: 'add',
    });

    useEffect(() => {

        if (selectedOffer != null) {
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
        // if (data.action == 'add') {

        // }

        if (data.action == 'update') {
            put(route('tarif.create', selectedOffer?.id), {
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
    };

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
                variant = "default"
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
            default:
                label = "Sedang Diproses"
                break;
        }

        return label
    }

    const formatCurrency = (value: number) => {
        if (!value) return '0';
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-numeric characters
        const rawValue = e.target.value.replace(/\D/g, '');

        // Convert to number
        const numericValue = rawValue ? Number(rawValue) : 0;

        setData(e.target.name as keyof OfferingForm, numericValue);
        return numericValue
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-9/12">
                <DialogHeader>
                    <DialogTitle>Penawaran {isView && <Badge variant={getVariant(selectedOffer?.status)}>{getLabel(selectedOffer?.status)}</Badge>}</DialogTitle>
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
                                    <div className="grid gap-2 px-8">
                                        <h3 className="text-xl font-bold">Penawaran Harga</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="basePrice">Harga Dasar</Label>
                                                <Input
                                                    id="basePrice"
                                                    name="basePrice"
                                                    type="tel"
                                                    required
                                                    tabIndex={14}
                                                    autoComplete="basePrice"
                                                    value={formatCurrency(data.basePrice)}
                                                    autoFocus
                                                    onChange={handleChange}
                                                    placeholder="contoh. 10.000"
                                                />
                                                <InputError message={errors.basePrice} />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="offeringPrice">Harga Penawaran</Label>
                                                <Input
                                                    id="offeringPrice"
                                                    name="offeringPrice"
                                                    type="tel"
                                                    required
                                                    tabIndex={15}
                                                    autoComplete="offeringPrice"
                                                    value={formatCurrency(data.offeringPrice)}
                                                    onChange={(e) => {
                                                        const value = handleChange(e)
                                                        setData('dealPrice', value)
                                                    }}
                                                    placeholder="contoh. 20.000"
                                                />
                                                <InputError message={errors.offeringPrice} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="dealPrice">Harga Kesepakatan</Label>
                                                <Input
                                                    id="dealPrice"
                                                    name="dealPrice"
                                                    type="tel"
                                                    required
                                                    tabIndex={16}
                                                    autoComplete="dealPrice"
                                                    value={formatCurrency(data.dealPrice)}
                                                    onChange={(e) => {
                                                        const value = handleChange(e)
                                                        if (selectedOffer?.status == "on_review_nego") {
                                                            if (value == 0) {

                                                            }
                                                        } else {
                                                            setData('status', "pending")
                                                        }
                                                        
                                                    }}
                                                    placeholder="contoh. 20.000"
                                                />
                                                <InputError message={errors.dealPrice} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="negoPrice">Harga Negosiasi</Label>
                                                <Input
                                                    id="negoPrice"
                                                    name="negoPrice"
                                                    type="tel"
                                                    required
                                                    tabIndex={17}
                                                    autoComplete="negoPrice"
                                                    value={formatCurrency(data.negoPrice)}
                                                    onChange={handleChange}
                                                    placeholder="contoh. 15.000"
                                                    disabled
                                                    readOnly
                                                />
                                                <InputError message={errors.negoPrice} />
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {selectedOffer?.status !== "on_review_nego" && <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Simpan harga penawaran
                                </Button>}

                                {selectedOffer?.status === "on_review_nego" &&  <><Button type="button" className="w-full" tabIndex={19} disabled={processing} onClick={() => confirmApprove(selectedOffer)}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Terima harga penawaran
                                </Button>
                                <Button type="button" variant={"outline"} className="w-full" tabIndex={20} disabled={processing} onClick={() => confirmReject(selectedOffer)}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Tolak harga penawaran
                                </Button></>}
                            </div>

                        </form>

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}