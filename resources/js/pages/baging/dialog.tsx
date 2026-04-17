import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData } from "@/types";
import { BagianTujuan, Kantor } from "@/types/manifest-serah";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowRight, LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { TransactionsData } from "@/types/marketing";
import { BagingData } from "@/types/baging";

interface BagingFormDialog {
    selectedData: BagingData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type BagingForm = {
    code: string;
    office: string;
    office_to: string;
    status: string;
    selectedItem: number[];
    action: 'add' | 'update';
};


export default function BagingFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: BagingFormDialog) {
    const { auth } = usePage<SharedData>().props;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const tujuans = page.props.tujuans as BagianTujuan[];
    const { data, setData, post, get, processing, errors, reset } = useForm<Required<BagingForm>>({
        code: "",
        office: "",
        status: "",
        office_to: "",
        action: 'add',
        selectedItem: [],
    });

    const [itemManifest, setItemManifest] = useState<TransactionsData[]>([])
    const [selectedManifestItem, setSelectedManifestItem] = useState<TransactionsData[]>([])

    const getListItem = (selectedData: BagingData) => {
        get(route('warehouse.baging', { m: selectedData.code }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setItemManifest(page.props.data_bags as TransactionsData[])
                let dataSelected = page.props.data_selected as TransactionsData[]
                setSelectedManifestItem(dataSelected)
                setData("selectedItem", dataSelected.map(item => item.id));
            },
            onError: (error) => {
                console.log(error);
            },
        })
    }

    useEffect(() => {

        if (selectedData != null) {
            console.log('selectedData', selectedData)
            setData('code', selectedData.code)
            setData('office_to', selectedData.office_to)
            setData('office', selectedData.office);
            setData('status', selectedData.status);
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
        setData("selectedItem", [...data.selectedItem, item.id]);
        // remove from left list
        setItemManifest((prev) => prev.filter((i) => i.id !== item.id));
    };

    const handleRemoveItem = (item: TransactionsData) => {
        setItemManifest((prev) => [...prev, item]);
        setSelectedManifestItem((prev) => prev.filter((i) => i.id !== item.id));
        setData("selectedItem", data.selectedItem.filter((id) => id !== item.id));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // if (data.action == 'add') {

        // }

        if (data.action == 'update') {
            post(route('warehouse.create_baging', selectedData?.id), {
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
        reset('code');
        reset('office');
        reset('status');
        reset('action');
        reset('office_to');
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
                    <DialogTitle>Tambah Data Detail Kantong {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        Kelola penambahan detail data kantong. Pastikan data yang dimasukkan sudah benar sebelum menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="flex w-full h-full gap-2">
                            <div className="w-full">
                                <Label htmlFor="officeTo">Item Belum Diproses</Label>
                                <div className="border-2 rounded-xl p-4 mt-3 overflow-y-auto h-4/5 w-full">
                                    {itemManifest?.map((item) => <div key={`item-${item.id}`} onClick={() => handleSelectItem(item)} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number} <ArrowRight /> </div>)}
                                </div>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="to">Item Terpilih</Label>
                                <div className="border-2 rounded-xl p-4 mt-4 overflow-y-auto  h-4/5 w-full">
                                    {selectedManifestItem?.map((item) => <div key={`selected-${item.id}`} onClick={() => handleRemoveItem(item)} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number} <X /></div>)}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Simpan Data Manifest
                        </Button>
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}