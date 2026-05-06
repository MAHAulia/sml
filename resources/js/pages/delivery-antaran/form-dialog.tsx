import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { SharedData } from "@/types";
import { DeliveryOrderData } from "@/types/delivery-order";
import { TransactionsData } from "@/types/marketing";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';


interface DeliveryOrderFormDialog {
    selectedData: DeliveryOrderData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type DeliveryOrderForm = {
    id: number;
    code: string;
    user_id: number;
    status: string;
    action: 'add' | 'update';
};


export default function DeliveryOrderFormDialog({ selectedData, isOpen, setIsOpen, isView = true }: DeliveryOrderFormDialog) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;
    const [selectedManifestItem, setSelectedManifestItem] = useState<TransactionsData[]>([])

    const { data, setData, get, post, put, processing, errors, reset } = useForm<Required<DeliveryOrderForm>>({
        id: 0,
        code: "",
        user_id: 0,
        status: "",
        action: 'add',
    });

    const getListItem = (selectedData: DeliveryOrderData) => {
        get(route("delivery-order.index", { m: selectedData.code }), {
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
            setData('id', selectedData.id)
            setData('code', selectedData.code);
            setData('user_id', selectedData.user_id);
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

        if (data.action == 'add') {
            const url = "delivery-order.create";
            // if (role === "Warehouse") {
            //     url = "warehouse.save_manifest_serah";
            // }

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
        reset('user_id');
        reset('status');
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
                    <DialogTitle>{isView ? 'Delivery Order' : 'Buat Delivery Order Baru'} {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        {isView ? 'Data Delivery Order' : 'Pembuatan Delivery Order baru'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            {isView && <div>
                                <h1>Data Delivery Order</h1>
                                <div className="border-2 rounded-xl p-4 mt-4 overflow-y-auto h-1/3 w-full">
                                    {selectedManifestItem?.map((item) => <div key={`selected-${item.id}`} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number ?? item.code}</div>)}
                                </div>
                            </div>}

                            {!isView && <Button type="submit" className="mt-4 w-full" tabIndex={14} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Buat Delivery Order
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