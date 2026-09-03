import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData } from "@/types";
import { Kantor, ManifestSerahData, Mobil } from "@/types/manifest-serah";
import { SuratJalanData } from "@/types/surat-jalan";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowRight, LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';


interface SuratJalanDialog {
    selectedData: SuratJalanData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type SuratJalanForm = {
    code: string;
    mobil_id: number | null;
    to: string;
    selectedItem: number[];
    action: 'add' | 'update';
};


export default function SuratJalanDialog({ selectedData, isOpen, setIsOpen, isView = true }: SuratJalanDialog) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const mobils = page.props.mobils as Mobil[];
    const { data, setData, post, get, processing, errors, reset } = useForm<Required<SuratJalanForm>>({
        code: "",
        mobil_id: null,
        action: 'add',
        to: '',
        selectedItem: [],
    });

    const [itemManifest, setItemManifest] = useState<ManifestSerahData[]>([])
    const [selectedManifestItem, setSelectedManifestItem] = useState<ManifestSerahData[]>([])

    const getListItem = (selectedData: SuratJalanData) => {
        let url = "warehouse.surat_jalan";
        if (role === "Driver") {
            url = "driver.surat_jalan";
        }

        get(route(url, { t: "local", m: selectedData.code }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const data = page.props
                console.log(data.dataSelected, data.dataSuratJalan)
                setItemManifest(page.props.dataSuratJalan as ManifestSerahData[])
                const dataSelected = page.props.dataSelected as ManifestSerahData[]
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
            setData('code', selectedData.code);
            setData('mobil_id', selectedData.mobil_id);
            setData('to', selectedData.to);
            setData('action', 'update');
            getListItem(selectedData);
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const handleSelectItem = (item: ManifestSerahData) => {
        // add to selected
        setSelectedManifestItem((prev) => [...prev, item]);
        setData("selectedItem", [...data.selectedItem, item.id]);
        // remove from left list
        setItemManifest((prev) => prev.filter((i) => i.id !== item.id));
    };

    const handleRemoveItem = (item: ManifestSerahData) => {
        setItemManifest((prev) => [...prev, item]);
        setSelectedManifestItem((prev) => prev.filter((i) => i.id !== item.id));
        setData("selectedItem", data.selectedItem.filter((id) => id !== item.id));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (data.action == 'update') {
            const url = "warehouse.save_surat_jalan";

            post(route(url, selectedData?.id), {
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
        reset('mobil_id');
        reset('action');
        reset('to');
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
                    <DialogTitle>Tambah Data Detail Surat Jalan {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        Kelola penambahan detail data surat jalan. Pastikan data yang dimasukkan sudah benar sebelum menyimpan.
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className={"grid grid-cols-2 gap-2"}>
                            <div className="grid gap-2">
                                <Label htmlFor="mobil">Mobil {data.mobil_id?.toString() || ''}</Label>
                                <Select
                                    value={data.mobil_id?.toString() || ''}
                                    onValueChange={(value) => setData('mobil_id', parseInt(value))}
                                    required
                                    disabled={isView}
                                >
                                    <SelectTrigger id="mobil" tabIndex={4} className="w-full">
                                        <SelectValue placeholder="Mobil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Mobil</SelectLabel>
                                            {mobils.map((mobil) => (
                                                <SelectItem key={mobil.id} value={mobil.id.toString()}>
                                                    {mobil.nopol} - {mobil.merek} - {mobil.description}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.mobil_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="to">Kantor Tujuan</Label>
                                <Select
                                    value={data.to}
                                    onValueChange={(value) => setData('to', value)}
                                    required
                                    disabled={isView}
                                >
                                    <SelectTrigger id="to" tabIndex={4} className="w-full">
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
                                <InputError message={errors.to} />
                            </div>
                        </div>

                        <div className="flex w-full h-full gap-2">
                            <div className="w-full">
                                <Label htmlFor="officeTo">Manifest Belum Dipilih</Label>
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
                            Simpan Data
                        </Button>
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}