import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { DeliveryOrderData } from '@/types/delivery-order';
import { Head, useForm, usePage } from '@inertiajs/react';
import { QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';


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
    const { delete: destroy, post, processing } = useForm();

    const [selectedData, setSelectedData] = useState<DeliveryOrderData | null>(null)
    const [selectedItemData, setSelectedItemData] = useState<DeliveryOrderData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<DeliveryOrderData>()
    const [isOpen, setIsOpen] = useState(false)
    const [tambahData, setTambahData] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)
    const [confirmation, setConfirmation] = useState({
        title: "",
        subtitle: "",
        message: "",
        action: "",
        label: "",
        danger: false,
        isShow: false,
    })

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('f');

    const handleView = (data: DeliveryOrderData) => {
        setIsOpen(true)
        setSelectedItemData(data)
        setisView(true)
    }

    const handleEdit = (data: DeliveryOrderData) => {
        setTambahData(true)
        setSelectedData(data)
        setisView(false)
    }

    const confirmDelete = (data: DeliveryOrderData) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
        setSelectedData(data)
    }

    const handleDelete = () => {
        const url = "delivery-order.create";
        post(route(url, { a: 'delete', m: selectedData?.code }), {
            onSuccess: () => {
                setShowConfirm(false)
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }

    const handleAdd = () => {
        setIsOpen(true)
        setSelectedData(null)
        setisView(false)
        // Call API Create Manifest
        // post(route('pickup.save_manifest_serah'), {
        //     onSuccess: () => {
        //         // Open Dialog For add item to manifest
        //         setIsOpen(true)
        //         setSelectedData(null)
        //         setisView(false)
        //     },
        //     onError: (error) => {
        //         console.log(error);
        //     },
        // });

    }

    const onTutup = (data: DeliveryOrderData) => {
        setSelectedData(data)
        setConfirmation({
            title: "Proses Antaran",
            subtitle: "Lanjutkan Proses Antaran",
            message: "Apakah Anda yakin ingin smelanjutkan ke proses antaran?",
            action: "approve",
            label: "Ya, Lanjutkan",
            danger: false,
            isShow: true,
        })
    }

    const handleConfirmation = () => {
        const url = "delivery-order.create";
        
        post(route(url, { a: 'approval', m: selectedData?.code }), {
            onSuccess: () => {
                setShowConfirm(false)
                setConfirmation({
                    title: "",
                    subtitle: "",
                    message: "",
                    action: "",
                    label: "",
                    danger: false,
                    isShow: false,
                })
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }

    useEffect(() => {
        if (filter) {
            handleAdd()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Delivery - Status Antaran" />

            <PageLayout title='Status Antaran' description="Perbaharui status antaran barang">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <Label>Nomor Order</Label>
                                <div className='flex gap-4'>
                                    <Input name='nomor_order' placeholder='cth. 192730912' />
                                    <Button><QrCode/></Button>
                                    <Button>Cari</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageLayout>
        </AppLayout>
    );
}
