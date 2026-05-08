import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SharedData, UserData } from "@/types";
import { InvoiceData } from "@/types/invoice";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';


interface InvoiceFormDialog {
    selectedData: InvoiceData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type InvoiceForm = {
    id: number | null;
    customerId: string | null;
    action: 'add' | 'update';
};


export default function InvoiceFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: InvoiceFormDialog) {
    const { auth, customers } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;
    const custmrs = customers as UserData[];

    console.log('customers', customers)
    const { data, setData, post, processing, errors, reset } = useForm<Required<InvoiceForm>>({
        id: null,
        customerId: null,
        action: 'add',
    });


    useEffect(() => {

        if (selectedData != null) {
            setData('customerId', selectedData.customer_id?.toString());
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = "invoice.store";

        if (data.action == 'add') {
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

        // if (data.action == 'update') {
        //     put(route('offering.update', selectedData?.id), {
        //         onSuccess: () => {
        //             resetForm();
        //             if (setIsOpen) {
        //                 setIsOpen(false);
        //             }
        //         },
        //         onError: (error) => {
        //             console.log(error);
        //         },
        //     });
        // }
    };

    const resetForm = () => {
        reset('id');
        reset('customerId');
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
            <DialogContent className="sm:max-w-4/12">
                <DialogHeader>
                    <DialogTitle>{isView ? 'Invoice' : 'Buat Invoice Baru'} {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        {isView ? 'Data Invoice' : 'Pembuatan Invoice baru'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>

                            <div className="grid grid-cols-1 gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="customer">Customer</Label>
                                    <Select
                                        value={data.customerId?.toString()}
                                        onValueChange={(value) => setData('customerId', value)}
                                        required
                                        disabled={isView}
                                    >
                                        <SelectTrigger id="type" tabIndex={4} className="w-full">
                                            <SelectValue placeholder="Customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Pilih Customer</SelectLabel>
                                                {custmrs.map((item) => <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>)}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.customerId} />
                                </div>
                            </div>

                            {!isView && <Button type="submit" className="mt-4 w-full" tabIndex={14} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Buat Invoice
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