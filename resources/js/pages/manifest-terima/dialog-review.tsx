import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from "@/components/input-error";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SharedData } from "@/types";
import { TransactionsData } from "@/types/marketing";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';


interface ManifestTerimaReviewDialog {
    selectedData: TransactionsData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
    onProcess: (data: TransactionsData | null) => void;
}

type ManifestTerimaForm = {
    id: number | null | undefined;
    order_number: string | null;
    total_item: number;
    p: number;
    l: number;
    t: number;
    weight: number;
    foto: File | null;
    action: 'add' | 'update';
};


export default function ManifestTerimaReviewDialog({ selectedData, isOpen, setIsOpen, isView = true, onProcess }: ManifestTerimaReviewDialog) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;

    const { data, setData, post, processing, errors, reset } = useForm<Required<ManifestTerimaForm>>({
        id: null,
        order_number: null,
        total_item: 0,
        p: 0,
        l: 0,
        t: 0,
        weight: 0,
        foto: null,
        action: 'add',
    });

    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {

        if (selectedData != null) {
            setData('id', selectedData.id)
            setData('order_number', selectedData.order_number);
            setData('total_item', selectedData.real_total ?? selectedData.total_item);
            setData('p', selectedData.real_p ?? selectedData.p);
            setData('l', selectedData.real_l ?? selectedData.l);
            setData('t', selectedData.real_t ?? selectedData.t);
            setData('weight', selectedData.real_weight ?? selectedData.weight);
            setData('action', 'update');
        }

    }, [selectedData]);


    const submit = () => {

        let url = "warehouse.save_manifest_terima";
        if (role === "Delivery") {
            url = "delivery.save_manifest_terima";
        }
        post(route(url, { a: 'review', id: selectedData?.id }), {
            onSuccess: () => {

                selectedData!.real_p = data.p
                selectedData!.real_l = data.l
                selectedData!.real_t = data.t
                selectedData!.real_total = data.total_item
                selectedData!.real_weight = data.weight

                resetForm();
                if (setIsOpen) {
                    setIsOpen(false);
                }
                onProcess(selectedData)
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const resetForm = () => {
        reset("id");
        reset("order_number");
        reset("total_item");
        reset("p");
        reset("l");
        reset("t");
        reset("weight");
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Periksa Data Manifest Item : {selectedData?.order_number}</DialogTitle>
                    <DialogDescription>
                        Periksa kembali data manifest yang akan diterima sebelum memprosesnya lebih lanjut
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-row-2 gap-2">
                            <div className="grid grid-rows-2 gap-4">
                                <div className="grid grid-cols-2 items-center">
                                    <Label htmlFor="total_item">Jumlah Barang (pcs)</Label>
                                    <Input
                                        id="total_item"
                                        type="number"
                                        required
                                        tabIndex={7}
                                        autoComplete="total_item"
                                        value={data.total_item}
                                        onChange={(e) => setData('total_item', e.target.value == '' ? 0 : Number(e.target.value))}
                                        placeholder="contoh. 2"
                                        disabled={isView}
                                        className="text-right"
                                    />
                                    <InputError message={errors.total_item} />
                                </div>
                                <div className="grid grid-cols-2 items-center">
                                    <Label htmlFor="weight">Berat (gram)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        required
                                        tabIndex={11}
                                        step="any"
                                        inputMode="decimal"
                                        autoComplete="off"
                                        value={data.weight}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setData('weight', value === '' ? 0 : parseFloat(value))
                                        }}
                                        placeholder="contoh. 12.5"
                                        disabled={isView}
                                        className="text-right"
                                    />
                                    <InputError message={errors.weight} />
                                </div>
                            </div>

                            <hr />

                            <div className="grid gap-2">
                                <Label htmlFor="dimension" className="mt-4 font-bold">Dimensi Barang</Label>
                                <div className="grid grid-rows-3 gap-4">
                                    <div className="grid grid-cols-2 items-center">
                                        <Label htmlFor="p">Panjang (cm)</Label>
                                        <Input
                                            id="p"
                                            type="number"
                                            tabIndex={8}
                                            step="any"
                                            inputMode="decimal"
                                            autoComplete="off"
                                            value={data.p}
                                            onChange={(e) => setData('p', e.target.value == '' ? 0 : Number(e.target.value))}
                                            placeholder="Panjang"
                                            disabled={isView}
                                            className="text-right"
                                        />
                                        <InputError message={errors.p} />
                                    </div>
                                    <div className="grid grid-cols-2 items-center">
                                        <Label htmlFor="l">Lebar (cm)</Label>
                                        <Input
                                            id="l"
                                            type="number"
                                            required
                                            tabIndex={9}
                                            autoComplete="l"
                                            value={data.l}
                                            onChange={(e) => setData('l', e.target.value == '' ? 0 : Number(e.target.value))}
                                            placeholder="Lebar"
                                            disabled={isView}
                                            className="text-right"
                                        />
                                        <InputError message={errors.l} />
                                    </div>
                                    <div className="grid grid-cols-2 items-center">
                                        <Label htmlFor="t">Tinggi (cm)</Label>
                                        <Input
                                            id="t"
                                            type="number"
                                            required
                                            tabIndex={10}
                                            autoComplete="t"
                                            value={data.t}
                                            onChange={(e) => setData('t', e.target.value == '' ? 0 : Number(e.target.value))}
                                            placeholder="Tinggi"
                                            disabled={isView}
                                            className="text-right"
                                        />
                                        <InputError message={errors.t} />
                                    </div>
                                    <div className="grid grid-cols-2 items-center">
                                        <Label htmlFor="t">Gambar Barang <small>optional</small></Label>
                                        <div>
                                            <Input type="file" id="picture-item" name="picture-item" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    setData('foto', file)
                                                    setPreview(URL.createObjectURL(file))
                                                }
                                            }} />
                                            {preview && (
                                                <img
                                                    src={preview}
                                                    alt="Preview gambar barang"
                                                    className="mt-2 h-32 w-32 rounded-md object-cover border"
                                                />
                                            )}
                                        </div>
                                        <InputError message={errors.t} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="mt-4" tabIndex={18} disabled={processing} onClick={submit}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Proses Item
                        </Button>
                    </div>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}