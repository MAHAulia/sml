import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData } from "@/types";
import { BagianTujuan, Kantor, ManifestTerimaData } from "@/types/manifest-terima";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowRight, LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { TransactionsData } from "@/types/marketing";
import { ManifestSerahData } from "@/types/manifest-serah";


interface ManifestTerimaFormDialog {
    selectedData: ManifestTerimaData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type ManifestTerimaForm = {
    manifest: string;
    to: string;
    office_to: string;
    type: string;
    selectedItem: number[];
    items: number[];
    action: 'add' | 'update';
};


export default function ManifestTerimaFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: ManifestTerimaFormDialog) {
    const { auth } = usePage<SharedData>().props;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const tujuans = page.props.tujuans as BagianTujuan[];
    const { data, setData, post, get, processing, errors, reset } = useForm<Required<ManifestTerimaForm>>({
        manifest: "",
        to: "",
        office_to: "",
        type: "",
        action: 'add',
        selectedItem: [],
        items: [],
    });

    const [itemManifest, setItemManifest] = useState<TransactionsData[]>([])
    const [selectedManifestItem, setSelectedManifestItem] = useState<TransactionsData[]>([])

    const getListItem = (selectedData: ManifestTerimaData) => {
        // if (selectedData.type === 'local') {
        //     console.log("Get data for local")
            get(route('warehouse.manifest_terima', { t: selectedData.type, m: selectedData.code }), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    let data = page.props.data_manifest as TransactionsData[]
                    setItemManifest(data)
                    setData("items", data.map(item => item.id));
                    let dataSelected = page.props.data_selected as TransactionsData[]
                    setSelectedManifestItem(dataSelected)
                    setData("selectedItem", dataSelected.map(item => item.id));
                },
                onError: (error) => {
                    console.log(error);
                },
            })
        // } else {
        //     console.log("Get for not local")
        // }
    }

    useEffect(() => {

        if (selectedData != null) {
            console.log('selectedData', selectedData)
            setData('manifest', selectedData.code)
            setData('to', selectedData.to);
            setData('office_to', selectedData.office_to);
            setData('type', selectedData.type);
            setData('action', 'update');
            getListItem(selectedData);
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const handleSelectItem = (item: TransactionsData) => {
        // add to selected
        setSelectedManifestItem((prev) => [...prev, item]);

        const updatedSelectedItems = data.selectedItem.includes(item.id)
            ? data.selectedItem
            : [...data.selectedItem, item.id];

        // remove from left list
        const updatedItems = data.items.filter((id) => id !== item.id);

        setData("selectedItem", updatedSelectedItems);
        setData("items", updatedItems);

        setItemManifest((prev) =>
            prev.filter((i) => i.id !== item.id)
        );
    };

    const handleRemoveItem = (item: TransactionsData) => {
        setItemManifest((prev) => [...prev, item]);

        const updatedItems = data.items.includes(item.id)
            ? data.items
            : [...data.items, item.id];

        const updatedSelectedItems = data.selectedItem.filter(
            (id) => id !== item.id
        );

        setData("items", updatedItems);
        setData("selectedItem", updatedSelectedItems);

        setSelectedManifestItem((prev) =>
            prev.filter((i) => i.id !== item.id)
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // if (data.action == 'add') {

        // }

        if (data.action == 'update') {
            post(route('warehouse.save_manifest_terima', { a: 'approval', m: selectedData?.code }), {
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
                    <DialogTitle>Terima Data Manifest {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        Kelola penambahan detail data manifest Terima. Pastikan data yang dimasukkan sudah benar sebelum menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
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
                                            {kantors.filter((kantor) => data.type === "local" ? kantor.code == auth.user.office : true).map((kantor) => (
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
                                            {tujuans.map((tujuan) => (
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

                        <div className="flex w-full h-full gap-2">
                            <div className="w-full">
                                <Label htmlFor="officeTo">Item Belum Diproses</Label>
                                <div className="border-2 rounded-xl p-4 mt-3 overflow-y-auto h-4/5 w-full">
                                    {itemManifest?.map((item) => <div key={`item-${item.id}`} onClick={() => handleSelectItem(item)} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number ?? item.code} <ArrowRight /> </div>)}
                                </div>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="to">Item Terpilih</Label>
                                <div className="border-2 rounded-xl p-4 mt-4 overflow-y-auto  h-4/5 w-full">
                                    {selectedManifestItem?.map((item) => <div key={`selected-${item.id}`} onClick={() => handleRemoveItem(item)} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number ?? item.code} <X /></div>)}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {itemManifest.length == 0 ? 'Simpan dan Tutup Manifest' : 'Simpan Data Manifest'}
                        </Button>
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}