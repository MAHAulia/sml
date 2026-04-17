import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData } from "@/types";
import { BagianTujuan, Kantor } from "@/types/manifest-serah";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { TransactionsData } from "@/types/marketing";
import { BagingData } from "@/types/baging";


interface BaggingFormDialog {
    selectedData: BagingData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type BaggingForm = {
    code: string;
    office: string;
    status: string;
    office_to: string;
    to: string;
    action: 'add' | 'update';
};


export default function BaggingFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: BaggingFormDialog) {
    const { auth } = usePage<SharedData>().props;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const tujuans = page.props.tujuans as BagianTujuan[];
    const [selectedManifestItem, setSelectedManifestItem] = useState<TransactionsData[]>([])

    const { data, setData, get, post, put, processing, errors, reset } = useForm<Required<BaggingForm>>({
        code: "",
        office: "",
        status: "",
        office_to: "",
        to: "",
        action: 'add',
    });

    const getListItem = (selectedData: BagingData) => {
        console.log("Get data for local")
        get(route('warehouse.baging', { m: selectedData.code, v: "T" }), {
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
            setData('code', selectedData.code);
            setData('office', selectedData.office);
            setData('office_to', selectedData.office_to);
            setData('status', selectedData.status);
            setData('action', 'update');
            getListItem(selectedData)
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action);
        if (data.action == 'add') {
            post(route('warehouse.create_baging'), {
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

        if (data.action == 'update') {
            put(route('offering.update', selectedData?.id), {
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
            <DialogContent className="sm:max-w-4/12">
                <DialogHeader>
                    <DialogTitle>{isView ? 'Bagging' : 'Buat Bagging Baru'} {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        {isView ? 'Data Bagging' : 'Pembuatan Bagging baru'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>

                            <div className={"grid grid-cols-1 gap-2"}>
                                <div className="grid gap-2">
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
                                                {kantors.filter((kantor) => kantor.code !== auth.user.office).map((kantor) => (
                                                    <SelectItem key={kantor.id} value={kantor.code.toString()}>{kantor.code} - {kantor.name}</SelectItem>
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
                                    {selectedManifestItem?.map((item) => <div key={`selected-${item.id}`} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number}</div>)}
                                </div>
                            </div>}

                            {!isView && <Button type="submit" className="mt-4 w-full" tabIndex={14} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Buka Kantong
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