import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InvoiceData } from "@/types/invoice";
import { TransactionsData } from "@/types/marketing";
import { useForm } from "@inertiajs/react";
import { ArrowRight, LoaderCircle, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';


interface InvoiceDialog {
    selectedData: InvoiceData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type InvoiceForm = {
    noInvoice: string;
    items: number[],
    selectedItem: number[],
    action: 'add' | 'update';
};


export default function InvoiceDialog({ selectedData, isOpen, setIsOpen, isView = true }: InvoiceDialog) {
    const { data, setData, post, get, processing, errors, reset } = useForm<Required<InvoiceForm>>({
        noInvoice: "",
        items: [],
        selectedItem: [],
        action: 'add',
    });

    const [itemInvoiceItem, setItemInvoiceItem] = useState<TransactionsData[]>([])
    const [selectedInvoiceItem, setSelectedInvoiceItem] = useState<TransactionsData[]>([])

    const getListItem = (selectedData: InvoiceData) => {
        get(route("invoice.index", { m: selectedData.no_invoice }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                console.log(page.props)
                const data = page.props.data_invoices as TransactionsData[]
                setItemInvoiceItem(data)
                setData("items", data.map(item => item.id));
                const dataSelected = page.props.invoice_selecteds as TransactionsData[]
                setSelectedInvoiceItem(dataSelected)
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
            setData('noInvoice', selectedData.no_invoice)
            setData('action', 'update');
            getListItem(selectedData);
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const handleSelectItem = (item: TransactionsData) => {
        // add to selected
        setSelectedInvoiceItem((prev) => [...prev, item]);

        const updatedSelectedItems = data.selectedItem.includes(item.id)
            ? data.selectedItem
            : [...data.selectedItem, item.id];

        // remove from left list
        const updatedItems = data.items.filter((id) => id !== item.id);

        setData("selectedItem", updatedSelectedItems);
        setData("items", updatedItems);

        setItemInvoiceItem((prev) =>
            prev.filter((i) => i.id !== item.id)
        );
    };

    const handleRemoveItem = (item: TransactionsData) => {
        setItemInvoiceItem((prev) => [...prev, item]);

        const updatedItems = data.items.includes(item.id)
            ? data.items
            : [...data.items, item.id];

        const updatedSelectedItems = data.selectedItem.filter(
            (id) => id !== item.id
        );

        setData("items", updatedItems);
        setData("selectedItem", updatedSelectedItems);

        setSelectedInvoiceItem((prev) =>
            prev.filter((i) => i.id !== item.id)
        );
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.action == 'update') {
            post(route("invoice.store", { a: 'approval', m: selectedData?.no_invoice }), {
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
        reset('noInvoice');
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

    const calculateTotal = () => {
        let total = 0
        selectedInvoiceItem?.forEach(element => {
            total += element.biaya?.deal_price ?? 0
        });
        return Number(total)
    }

    const calculateTax = (total: number) => {
        let tax = 0
        tax = (11/100) * total
        return Number(tax)
    }

    const calculateSub = () => {
        const total = calculateTotal()
        const tax = calculateTax(total)
        return Number(total + tax)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-9/12">
                <DialogHeader>
                    <DialogTitle>Invoice {isView && <Badge variant={getVariant(selectedData?.status)}>{getLabel(selectedData?.status)}</Badge>}</DialogTitle>
                    <DialogDescription>
                        Kelola data invoice di sini
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4 border-t-2">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="flex justify-between">
                            <div>

                            </div>
                            <div className="text-right">
                                <h1 className="text-2xl font-bold">Invoice</h1>
                                <h2 className="text-xl font-bold">#{selectedData?.no_invoice}</h2>
                                <h3>Tanggal : {selectedData?.created_at}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <div className="font-bold">Bill To</div>
                                <div>{selectedData?.mitra?.name}</div>
                            </div>
                            <div>
                                <div className="font-bold">Ship To</div>
                                <div>{selectedData?.mitra?.address}</div>
                            </div>
                            <div></div>
                        </div>

                        <div className="flex w-full h-full gap-2 border-t-2">
                            <div className="w-full mt-4">
                                <Label htmlFor="officeTo">Transaksi</Label>
                                <div className="border-2 rounded-xl p-4 mt-3 overflow-y-auto h-4/5 w-full">
                                    {itemInvoiceItem?.map((item,i) => <div key={`item-${item.id}-${i}`} onClick={() => handleSelectItem(item)} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">{item.order_number ?? item.code} <ArrowRight /> </div>)}
                                </div>
                            </div>
                            <div className="w-full mt-4">
                                <Label htmlFor="to">Transaksi Terpilih</Label>
                                <div className="border-2 rounded-xl p-4 mt-3 overflow-y-auto  h-4/5 w-full">
                                    {selectedInvoiceItem?.map((item) => <div key={`selected-${item.id}`} onClick={() => handleRemoveItem(item)} className="cursor-pointer border-2 m-2 rounded-lg p-2 flex justify-between">
                                        <div className="flex flex-col items-end w-full mx-4">
                                            <div className="font-bold text-lg"><Badge variant={item.delivery_status == 'null' ? 'destructive' : item.delivery_status == "success" ? 'success' : 'secondary'}>{item.delivery_status == 'null' ? 'Belum Terantar' : item.delivery_status}</Badge> - {item.order_number} </div>
                                            <div>Rp {Number(item.biaya?.deal_price ?? 0).toLocaleString()}</div>
                                        </div>
                                        <X />
                                    </div>)}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                            <div>

                            </div>
                            <div>
                                <div className="grid grid-cols-2 gap-2 text-right my-2">
                                    <div className="font-bold text-lg">Total</div>
                                    <div>Rp {calculateTotal().toLocaleString()}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-right border-b-2 my-2">
                                    <div className="font-bold text-lg">PPn (11%)</div>
                                    <div>Rp {calculateTax(calculateTotal()).toLocaleString()}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-right my-2">
                                    <div className="font-bold text-xl">Total Akhir</div>
                                    <div className="font-bold text-xl">Rp {calculateSub().toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Simpan Data Invoice
                        </Button>
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}