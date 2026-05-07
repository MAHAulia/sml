import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { DeliveryOrderData } from '@/types/delivery-order';
import { TransactionsData } from '@/types/marketing';
import { Head, useForm, usePage } from '@inertiajs/react';
import { QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import DeliveryAntaranStatusDialog from './dialog';
import { set } from 'date-fns';


interface DeliveryOrderProps {
    datas: DeliveryOrderData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Status Antaran',
        href: '/Status Antaran',
    },
];

export default function DeliveryOrderAntaran({ datas }: DeliveryOrderProps) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;
    const { data, setData, get, post, processing } = useForm();
    const [deliveryData, setDeliveryData] = useState<TransactionsData | null>(null);
    const [isOpen, setIsOpen] = useState(false)

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('code');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('delivery-antaran.search'), {
            onSuccess: (response) => {
                setDeliveryData(response.props.data as TransactionsData);
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Delivery - Status Antaran" />

            <PageLayout title='Status Antaran' description="Perbaharui status antaran barang">
                <DeliveryAntaranStatusDialog
                    selectedData={deliveryData}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isView={false} />
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <div className='grid grid-cols-2 gap-4'>
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <Label>Nomor Order</Label>
                                <div className='flex gap-4'>
                                    <Input name='nomor_order' placeholder='cth. 192730912' required onChange={(e) => setData('code', e.target.value)} />
                                    <Button type="button"><QrCode /></Button>
                                    <Button type="submit" id='cariButton'>Cari</Button>
                                </div>
                            </form>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

                            {/* Main Content */}
                            {deliveryData && (
                                <div className="lg:col-span-2 rounded-2xl shadow-md border border-gray-200 p-6 space-y-6 mt-4">

                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {deliveryData.order_number}
                                            </h2>

                                            <p className="text-sm">
                                                Created at{" "}
                                                {new Date(deliveryData.created_at).toLocaleString()}
                                            </p>
                                        </div>

                                        {deliveryData.delivery_status == "null" && (
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setIsOpen(true)
                                                    setDeliveryData(deliveryData)
                                                }}
                                            >
                                                Ubah Status Antaran
                                            </Button>
                                        )}
                                    </div>

                                    {/* Shipment Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="rounded-xl p-4">
                                            <p className="text-sm">Delivery Status</p>

                                            <p className="font-semibold">
                                                {deliveryData.delivery_status == 'null'
                                                    ? "-"
                                                    : deliveryData.delivery_status}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Sender & Receiver */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Sender */}
                                        <div className="border border-gray-200 rounded-xl p-4">
                                            <h3 className="text-lg font-semibold mb-3">
                                                Sender
                                            </h3>

                                            <div className="space-y-2 text-sm">
                                                <p>
                                                    <span className="font-medium">Name:</span>{" "}
                                                    {deliveryData.senderName}
                                                </p>

                                                <p>
                                                    <span className="font-medium">Phone:</span>{" "}
                                                    {deliveryData.senderPhone}
                                                </p>

                                                <p>
                                                    <span className="font-medium">Address:</span><br />
                                                    {deliveryData.senderAddress}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Receiver */}
                                        <div className="border border-gray-200 rounded-xl p-4">
                                            <h3 className="text-lg font-semibold mb-3">
                                                Receiver
                                            </h3>

                                            <div className="space-y-2 text-sm">
                                                <p>
                                                    <span className="font-medium">Name:</span>{" "}
                                                    {deliveryData.receiverName}
                                                </p>

                                                <p>
                                                    <span className="font-medium">Phone:</span>{" "}
                                                    {deliveryData.receiverPhone}
                                                </p>

                                                <p>
                                                    <span className="font-medium">Address:</span><br />
                                                    {deliveryData.receiverAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Detail */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">
                                            Package Detail
                                        </h3>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="rounded-xl p-4">
                                                <p className="text-sm">Weight</p>

                                                <p className="font-bold">
                                                    {deliveryData.weight} Kg
                                                </p>
                                            </div>

                                            <div className="rounded-xl p-4">
                                                <p className="text-sm">Total Item</p>

                                                <p className="font-bold">
                                                    {deliveryData.total_item}
                                                </p>
                                            </div>

                                            <div className="rounded-xl p-4">
                                                <p className="text-sm">Dimension</p>

                                                <p className="font-bold">
                                                    {deliveryData.p} × {deliveryData.l} × {deliveryData.t}
                                                </p>
                                            </div>

                                            <div className="rounded-xl p-4">
                                                <p className="text-sm">Item</p>

                                                <p className="font-bold">
                                                    {deliveryData.isiKiriman}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="border border-gray-200 rounded-xl p-4">
                                        <h3 className="font-semibold mb-2">
                                            Catatan
                                        </h3>

                                        <p className="text-sm">
                                            {deliveryData.catatan || "-"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Image */}
                            {deliveryData?.bukti_url && (
                                <div className="lg:col-span-1 mt-4">
                                    <div className="rounded-2xl shadow-md border border-gray-200 p-4">
                                        <h3 className="text-lg font-semibold mb-4">
                                            Bukti Pengantaran
                                        </h3>

                                        <div className="border border-gray-200 rounded-2xl overflow-hidden">
                                            <img
                                                src={deliveryData.bukti_url}
                                                alt="Bukti Pengantaran"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </PageLayout>
        </AppLayout>
    );
}
