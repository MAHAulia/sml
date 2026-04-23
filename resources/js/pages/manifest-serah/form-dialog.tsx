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
import { FormEventHandler, useEffect, useState } from 'react';
import { TransactionsData } from "@/types/marketing";


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
    const role = auth.user.roles[0].name;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const tujuans = page.props.tujuans as BagianTujuan[];
    const [selectedManifestItem, setSelectedManifestItem] = useState<TransactionsData[]>([])

    const { data, setData, get, post, put, processing, errors, reset } = useForm<Required<ManifestSerahForm>>({
        to: "",
        office_to: "",
        type: "",
        action: 'add',
    });

    const getListItem = (selectedData: ManifestSerahData) => {
        let url = "pickup.manifest_serah";
        if (role === "Warehouse") {
            url = "warehouse.manifest_serah";
        }
        get(route(url, { t: selectedData.type, m: selectedData.code }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                let dataSelected = page.props.data_selected as TransactionsData[]

                setSelectedManifestItem(dataSelected)
            },
            onError: (error) => {
                console.log(error);
            },
        })
    }

    useEffect(() => {

        if (selectedData != null) {
            setData('to', selectedData.to);
            setData('office_to', selectedData.office_to);
            setData('type', selectedData.type);
            setData('action', 'update');
            getListItem(selectedData)
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.action == 'add') {
            let url = "pickup.save_manifest_serah";
            if (role === "Warehouse") {
                url = "warehouse.save_manifest_serah";
            }

            post(route(url), {
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
            <DialogContent className={data.type === "linehaul" ? "sm:max-w-6/12" : "sm:max-w-4/12"}>
                <DialogHeader>
                    <DialogTitle>{isView ? 'Manifest Serah' : 'Buat Manifest Baru'} {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        {isView ? 'Data Manifest Serah' : 'Pembuatan Manifest Serah baru'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>

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
                                                {tujuans.filter((tujuan) => data.type !== "local" ? tujuan.name === "Warehouse" : true).map((tujuan) => (
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

                            {isView && <div>
                                <h1>Data Manifest</h1>
                                <div className="border-2 rounded-xl p-4 mt-4 overflow-y-auto h-1/3 w-full">
                                    {selectedManifestItem?.map((item) => <div key={`selected-${item.id}`} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number ?? item.code}</div>)}
                                </div>
                            </div>}

                            {!isView && <Button type="submit" className="mt-4 w-full" tabIndex={14} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>}
                            {data.action == "add" && !isView && <Button variant="outline" type="reset" className="w-full" tabIndex={15} disabled={processing} onClick={() => resetForm()}>
                                Batal
                            </Button>}
                        </form>

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}