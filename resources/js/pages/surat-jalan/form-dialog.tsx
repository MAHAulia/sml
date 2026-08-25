import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData } from "@/types";
import { Kantor, Mobil } from "@/types/manifest-serah";
import { TransactionsData } from "@/types/marketing";
import { SuratJalanData } from "@/types/surat-jalan";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';


interface SuratJalanFormDialog {
    selectedData: SuratJalanData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type SuratJalanForm = {
    code: string;
    mobil_id: number | null;
    to: string;
    action: 'add' | 'update';
};


export default function SuratJalanFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: SuratJalanFormDialog) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;
    const page = usePage();
    const kantors = page.props.kantors as Kantor[];
    const mobils = page.props.mobils as Mobil[];
    const [selectedManifestItem, setSelectedManifestItem] = useState<TransactionsData[]>([])

    const { data, setData, get, post, put, processing, errors, reset } = useForm<Required<SuratJalanForm>>({
        code: "",
        mobil_id: null,
        action: 'add',
        to: '',
    });

    const getListItem = (selectedData: SuratJalanData) => {
        let url = "pickup.manifest_serah";
        if (role === "Warehouse") {
            url = "warehouse.manifest_serah";
        }
        get(route(url, { t: null, m: selectedData.code }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const dataSelected = page.props.data_selected as TransactionsData[]

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
            setData('mobil_id', selectedData.mobil_id);
            setData('to', selectedData.to);
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
            const url = "warehouse.save_surat_jalan";

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
        reset('code');
        reset('mobil_id');
        reset('action');
        reset('to');
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={"sm:max-w-5/12"}>
                <DialogHeader>
                    <DialogTitle>{isView ? 'Surat Jalan' : 'Buat Surat Jalan Baru'}</DialogTitle>
                    <DialogDescription>
                        {isView ? 'Data Surat Jalan' : 'Pembuatan Surat Jalan baru'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
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