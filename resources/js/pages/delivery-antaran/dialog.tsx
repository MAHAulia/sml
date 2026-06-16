import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { TextArea } from "@/components/ui/textarea";
import { SharedData } from "@/types";
import { TransactionsData } from "@/types/marketing";
import { useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';


interface DeliveryAntaranStatusDialog {
    selectedData: TransactionsData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

type DeliveryAntaranStatusForm = {
    id: number;
    code: string;
    reason: string;
    status: string;
    bukti: File | null;
    latitude: string;
    longitude: string;
    action: 'add' | 'update';
};


export default function DeliveryAntaranStatusDialog({ selectedData, isOpen, setIsOpen, isView = true }: DeliveryAntaranStatusDialog) {
    const { auth } = usePage<SharedData>().props

    const { data, setData, post, processing, errors, reset } = useForm<Required<DeliveryAntaranStatusForm>>({
        id: 0,
        code: "",
        reason: "",
        status: "",
        bukti: null,
        latitude: "",
        longitude: "",
        action: 'add',
    });

    useEffect(() => {
        if (selectedData != null) {
            setData('code', selectedData.order_number)
            setData('reason', selectedData.reason ?? "")
            setData('status', selectedData.status);
            setData('action', 'update');
        } else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("delivery-antaran.update", selectedData?.id), {
            forceFormData: true,
            onSuccess: () => {
                resetForm();
                if (setIsOpen) {
                    setIsOpen(false);
                }
                document.getElementById('cariButton')?.click();
            },
            onError: (error) => {
                console.log(error);
            },
        });
    };

    useEffect(() => {

        if (isOpen) {

            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(
                    (position) => {

                        setData('latitude', position.coords.latitude.toString());

                        setData('longitude', position.coords.longitude.toString());

                        console.log('Latitude:', position.coords.latitude);
                        console.log('Longitude:', position.coords.longitude);
                    },

                    (error) => {
                        console.log('Geolocation error:', error);
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                    }
                );
            }
        }

    }, [isOpen]);


    const resetForm = () => {
        reset('code');
        reset('reason');
        reset('status');
        reset('action');
        reset('latitude');
        reset('longitude');
        reset('bukti');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Perbaharui Status Antaran</DialogTitle>
                    <DialogDescription>
                        Kelola status antaran barang untuk transaksi dengan nomor order <br />{selectedData?.order_number ?? selectedData?.code}
                    </DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="gap-2">
                            <Label htmlFor="bukti" className="text-sm font-medium">Bukti Pengantaran</Label>
                            <Input type="file" id="bukti" name="bukti" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setData('bukti', file)
                                }
                            }} />
                            {errors.bukti && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.bukti}
                                </p>
                            )}
                        </div>
                        <div className="gap-2">
                            <Label htmlFor="status" className="text-sm font-medium">Status Antaran</Label>
                            <select
                                id="status"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                required
                            >
                                <option value="">Pilih status antaran</option>
                                <option value="success">Sukses Antar</option>
                                <option value="failed">Gagal Antar</option>
                                <option value="retour">Antar Ulang</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                        {(data.status == "failed" || data.status == "retour") && <div className="gap-2">
                            <Label htmlFor="reason" className="text-sm font-medium">Alasan</Label>
                            <TextArea
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                required={data.status === "failed" || data.status === "retour"}
                                className="h-24"
                            />
                        </div>}

                        <Button type="submit" className="mt-4 w-full" tabIndex={18} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </form>

                    {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </DialogContent>
        </Dialog>
    )
}