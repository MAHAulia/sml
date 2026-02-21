import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { MenuData } from "@/types";
import MenuForm from "./form";
import { router, useForm, usePage } from "@inertiajs/react";
import ErrorBoundary from '@/components/error-boundary';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import { createElement, FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { TextArea } from "@/components/ui/textarea";
import { CustomerData, SelectedOffer } from "@/types/customer";


interface OfferingFormDialog {
    selectedOffer: SelectedOffer | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type OfferingForm = {
    senderName: string;
    senderAddress: string;
    receiverName: string;
    receiverAddress: string;
    p: number;
    l: number;
    t: number;
    jumlah: number;
    berat: number;
    isiKiriman: string;
    catatan: string;
    action: string;
};


export default function OfferingFormDialog({ selectedOffer, isOpen, setIsOpen, isView = true }: OfferingFormDialog) {
    const [selectIsOpen, setSelectIsOpen] = useState(false)
    const page = usePage();
    const customers = page.props.customers as CustomerData[];
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<OfferingForm>>({
        senderName: "",
        senderAddress: "",
        receiverName: "",
        receiverAddress: "",
        p: 0,
        l: 0,
        t: 0,
        jumlah: 0,
        berat: 0,
        isiKiriman: "",
        catatan: "",
        action: 'add',
    });

    useEffect(() => {

        if (selectedOffer != null) {
            setData('senderName', selectedOffer.sender.name);
            setData('senderAddress', selectedOffer.sender.address);
            setData('receiverName', selectedOffer.receiver.name);
            setData('receiverAddress', selectedOffer.receiver.address);
            setData('p', selectedOffer.dimention.p);
            setData('l', selectedOffer.dimention.l);
            setData('t', selectedOffer.dimention.t);
            setData('berat', selectedOffer.berat);
            setData('isiKiriman', selectedOffer.isiKiriman);
            setData('catatan', selectedOffer.catatan);
            setData('action', 'update');
        } else {
            resetForm()
        }
    }, [selectedOffer]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action);
        if (data.action == 'add') {
            post(route('menu.store'), {
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
            put(route('menu.update', selectedOffer?.id), {
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
        reset('senderName');
        reset('senderAddress');
        reset('receiverName');
        reset('receiverAddress');
        reset('berat');
        reset('p');
        reset('l');
        reset('t');
        reset('action');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-9/12">
                <DialogHeader>
                    <DialogTitle>Penawaran</DialogTitle>
                    <DialogDescription>
                        Formulir data penawaran layanan
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="customer">Customer</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Popover open={selectIsOpen} onOpenChange={setSelectIsOpen} >
                                            <PopoverTrigger asChild className="w-full">
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={selectIsOpen}
                                                    className="w-full justify-between"
                                                    tabIndex={3}
                                                >
                                                    {
                                                        data.senderName != "" ? data.senderName : 'Silahkan pilih customer'
                                                    }
                                                    <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" >
                                                <Command>
                                                    <CommandInput placeholder="Cari icons..." />
                                                    <CommandList>
                                                        <CommandEmpty>Tidak customer yang ditemukan.</CommandEmpty>
                                                        <CommandGroup>
                                                            <ErrorBoundary>
                                                                {customers.map((customer, i) => {
                                                                    return (
                                                                        <CommandItem
                                                                            key={i}
                                                                            value={customer.id.toString()}
                                                                            onSelect={(currentValue) => {
                                                                                const customer = customers.find((item) => item.id == Number(currentValue))
                                                                                setData('senderName', customer?.name ?? "");
                                                                                setData('senderAddress', customer?.address ?? "");
                                                                                setSelectIsOpen(false);
                                                                            }}
                                                                            className="flex items-center justify-between"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                [{customer.phone}/{customer.email}] -  {customer.name}
                                                                            </div>
                                                                            <Icons.Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    data.senderName === customer.id.toString() ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    );
                                                                })
                                                                }
                                                            </ErrorBoundary>
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    <Button type="button" onClick={() => router.visit(route('customer.index', {'f': 'offering'})) }>Tambah Customer Baru</Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
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
                                                onChange={(e) => setData('senderName', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                            />
                                            <InputError message={errors.senderName} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="senderAddress">Alamat Pengirim</Label>
                                            <TextArea
                                                id="senderAddress"
                                                required
                                                tabIndex={1}
                                                autoComplete="senderAddress"
                                                value={data.senderAddress}
                                                onChange={(e) => setData('senderAddress', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
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
                                                tabIndex={1}
                                                autoComplete="receiverName"
                                                value={data.receiverName}
                                                onChange={(e) => setData('receiverName', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                            />
                                            <InputError message={errors.receiverName} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="receiverAddress">Alamat Penerima</Label>
                                            <TextArea
                                                id="receiverAddress"
                                                required
                                                tabIndex={1}
                                                autoComplete="receiverAddress"
                                                value={data.receiverAddress}
                                                onChange={(e) => setData('receiverAddress', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                                className="h-24"
                                            />
                                            <InputError message={errors.receiverAddress} />
                                        </div>

                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="senderName">Jumlah Barang</Label>
                                            <Input
                                                id="senderName"
                                                type="number"
                                                required
                                                tabIndex={1}
                                                autoComplete="senderName"
                                                value={data.senderName}
                                                onChange={(e) => setData('senderName', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                            />
                                            <InputError message={errors.senderName} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="senderAddress">Dimensi Barang</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input
                                                    id="senderName"
                                                    type="number"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="senderName"
                                                    value={data.senderName}
                                                    onChange={(e) => setData('senderName', e.target.value)}
                                                    placeholder="Panjang"
                                                    disabled={isView}
                                                />
                                                <InputError message={errors.senderAddress} />
                                                <Input
                                                    id="senderName"
                                                    type="number"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="senderName"
                                                    value={data.senderName}
                                                    onChange={(e) => setData('senderName', e.target.value)}
                                                    placeholder="Lebar"
                                                    disabled={isView}
                                                />
                                                <InputError message={errors.senderAddress} />
                                                <Input
                                                    id="senderName"
                                                    type="number"
                                                    required
                                                    tabIndex={1}
                                                    autoComplete="senderName"
                                                    value={data.senderName}
                                                    onChange={(e) => setData('senderName', e.target.value)}
                                                    placeholder="Tinggi"
                                                    disabled={isView}
                                                />
                                                <InputError message={errors.senderAddress} />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="senderName">Berat</Label>
                                            <Input
                                                id="senderName"
                                                type="number"
                                                required
                                                tabIndex={1}
                                                autoComplete="senderName"
                                                value={data.senderName}
                                                onChange={(e) => setData('senderName', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                            />
                                            <InputError message={errors.senderName} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="receiverName">Isi Kiriman</Label>
                                            <Input
                                                id="receiverName"
                                                type="text"
                                                required
                                                tabIndex={1}
                                                autoComplete="receiverName"
                                                value={data.receiverName}
                                                onChange={(e) => setData('receiverName', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                            />
                                            <InputError message={errors.receiverName} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="receiverAddress">Catatan</Label>
                                            <TextArea
                                                id="receiverAddress"
                                                required
                                                tabIndex={1}
                                                autoComplete="receiverAddress"
                                                value={data.receiverAddress}
                                                onChange={(e) => setData('receiverAddress', e.target.value)}
                                                placeholder="contoh. Laporan Baru"
                                                disabled={isView}
                                                className="h-24"
                                            />
                                            <InputError message={errors.receiverAddress} />
                                        </div>

                                    </div>
                                </div>

                                {!isView && <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>}
                                {data.action == "add" && !isView && <Button variant="outline" type="reset" className="w-full" tabIndex={5} disabled={processing} onClick={() => resetForm()}>
                                    Batal
                                </Button>}
                            </div>

                            {/* <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div> */}
                        </form>

                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}