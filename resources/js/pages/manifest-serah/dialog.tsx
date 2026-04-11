import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData } from "@/types";
import { BagianTujuan, Kantor, ManifestSerahData } from "@/types/manifest-serah";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';


interface ManifestSerahFormDialog {
    selectedData: ManifestSerahData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type ManifestSerahForm = {
    to: string;
    office_to: string;
    type: string;
    action: 'add' | 'update';
};


export default function ManifestSerahFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: ManifestSerahFormDialog) {
    const { auth } = usePage<SharedData>().props;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const tujuans = page.props.tujuans as BagianTujuan[];
    const { data, setData, put, processing, errors, reset } = useForm<Required<ManifestSerahForm>>({
        to: "",
        office_to: "",
        type: "",
        action: 'add',
    });

    useEffect(() => {

        if (selectedData != null) {
            setData('to', selectedData.to);
            setData('office_to', selectedData.office_to);
            setData('type', selectedData.type);
            setData('action', 'update');
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // if (data.action == 'add') {

        // }

        if (data.action == 'update') {
            put(route('tarif.create', selectedData?.id), {
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
        reset('to');
        reset('office_to');
        reset('type');
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
            default:
                label = "Sedang Diproses"
                break;
        }

        return label
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-9/12">
                <DialogHeader>
                    <DialogTitle>Tambah Data Detail Manifest {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        Kelola penambahan detail data manifest serah. Pastikan data yang dimasukkan sudah benar sebelum menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">

                                <div className={data.type === "linehaul" ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-2"}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="senderPhone">Jenis</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value)}
                                            required
                                            disabled={isView}
                                        >
                                            <SelectTrigger id="type" tabIndex={4} className="w-full">
                                                <SelectValue placeholder="Lokal / Antar Cabang / Antar Kota" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Jenis Manifest</SelectLabel>
                                                    <SelectItem value="local">Lokal</SelectItem>
                                                    <SelectItem value="linehaul">Antar Cabang / Antar Kota</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.type} />
                                    </div>

                                    {data.type === "linehaul" && <div className="grid gap-2">
                                        <Label htmlFor="officeTo">Kantor Tujuan</Label>
                                        <Select
                                            value={data.office_to}
                                            onValueChange={(value) => setData('office_to', value)}
                                            required
                                            disabled={isView}
                                        >
                                            <SelectTrigger id="officeTo" tabIndex={4} className="w-full">
                                                <SelectValue placeholder="Kantor Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Kantor Tujuan</SelectLabel>
                                                    {kantors.filter((kantor) => data.type === "local" ? kantor.code == auth.user.office : kantor.code !== auth.user.office).map((kantor) => (
                                                        <SelectItem key={kantor.id} value={kantor.code.toString()}>{kantor.code} - {kantor.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.office_to} />
                                    </div>}
                                    <div className="grid gap-2">
                                        <Label htmlFor="to">Bagian Tujuan</Label>
                                        <Select
                                            value={data.to}
                                            onValueChange={(value) => setData('to', value)}
                                            required
                                            disabled={isView}
                                        >
                                            <SelectTrigger id="to" tabIndex={4} className="w-full">
                                                <SelectValue placeholder="Bagian Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Bagian Tujuan</SelectLabel>
                                                    {tujuans.filter((tujuan) => data.type === "local" ? tujuan.name === "Delivery" : tujuan.name === "Warehouse").map((tujuan) => (
                                                        <SelectItem key={tujuan.id} value={tujuan.name}>
                                                            {tujuan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.office_to} />
                                    </div>
                                </div>

                                <div className={data.type === "linehaul" ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-2"}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="officeTo">Barang Belum Diproses</Label>
                                        {/* {manifests.map((manifest) => (
                                            <div key={manifest.id} className="border p-2">
                                                {manifest.code}
                                            </div>
                                        ))} */}
                                        {/* <Select
                                            value={data.office_to}
                                            onValueChange={(value) => setData('office_to', value)}
                                            required
                                            disabled={isView}
                                        >
                                            <SelectTrigger id="officeTo" tabIndex={4} className="w-full">
                                                <SelectValue placeholder="Kantor Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Kantor Tujuan</SelectLabel>
                                                    {kantors.filter((kantor) => data.type === "local" ? kantor.code == auth.user.office : kantor.code !== auth.user.office).map((kantor) => (
                                                        <SelectItem key={kantor.id} value={kantor.code.toString()}>{kantor.code} - {kantor.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select> */}
                                        <InputError message={errors.office_to} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="to">Barang Terpilih</Label>
                                        {/* <Select
                                            value={data.to}
                                            onValueChange={(value) => setData('to', value)}
                                            required
                                            disabled={isView}
                                        >
                                            <SelectTrigger id="to" tabIndex={4} className="w-full">
                                                <SelectValue placeholder="Bagian Tujuan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Bagian Tujuan</SelectLabel>
                                                    {tujuans.filter((tujuan) => data.type === "local" ? tujuan.name === "Delivery" : tujuan.name === "Warehouse").map((tujuan) => (
                                                        <SelectItem key={tujuan.id} value={tujuan.name}>
                                                            {tujuan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select> */}
                                        <InputError message={errors.office_to} />
                                    </div>
                                </div>

                                <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Simpan Data Manifest
                                </Button>
                            </div>

                        </form>

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}