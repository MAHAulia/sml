import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import MenuForm from "./form";
import { useForm, usePage } from "@inertiajs/react";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Icons from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import {  FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { CustomerData } from "@/types/customer";
import { TextArea } from "@/components/ui/textarea";

interface MenuFormDialog {
    selectedMenu: CustomerData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type MenuForm = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    action: string;
};


export default function MenuFormDialog({ selectedMenu, isOpen, setIsOpen, isView = true }: MenuFormDialog) {
    const page = usePage();
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<MenuForm>>({
        id: 0,
        name: '',
        email: '',
        phone: '',
        address: '',
        action: 'add',
    });

    useEffect(() => {

        if (selectedMenu != null) {
            setData('name', selectedMenu.name);
            setData('email', selectedMenu.email);
            setData('phone', selectedMenu.phone);
            setData('address', selectedMenu.address);
            setData('action', 'update');
        } else {
            resetForm()
        }
    }, [selectedMenu]);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action);
        if (data.action == 'add') {
            post(route('customer.store'), {
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
            put(route('customer.update', selectedMenu?.id), {
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
        reset('id');
        reset('name');
        reset('email');
        reset('address');
        reset('action');
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>Customer</DialogTitle>
                    <DialogDescription>
                        Data Customer
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="contoh. Fulan bin fulan"
                                        disabled={isView}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contoh: email@email.com"
                                        disabled={isView}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        tabIndex={3}
                                        autoComplete="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="contoh: 081321432123"
                                        disabled={isView}
                                        maxLength={15}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <TextArea
                                        id="address"
                                        tabIndex={4}
                                        autoComplete="address"
                                        value={data.address}
                                        className="h-24"
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="contoh: Jl. Tengah jalan 123"
                                        disabled={isView}
                                    />
                                    <InputError message={errors.address} />
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