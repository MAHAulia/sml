import ConfirmationDialog from '@/components/confirm-dialog';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { DeliveryOrderData } from '@/types/delivery-order';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DOFormDialog from './dialog';
import DeliveryOrderFormDialog from './form-dialog';
import DeliveryOrderTable from './table';
import { deliveryOrderTableColumns } from './table-column';


interface DeliveryOrderProps {
    datas: DeliveryOrderData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Delivery Order',
        href: '/Delivery Order',
    },
];

export default function DeliveryOrder({ datas }: DeliveryOrderProps) {
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

    const onTutupManifest = (data: DeliveryOrderData) => {
        setSelectedData(data)
        setConfirmation({
            title: "Tutup Manifest",
            subtitle: "Proses Tutup Manifest",
            message: "Apakah Anda yakin ingin menutup manifest, untuk proses berikutnya",
            action: "approve",
            label: "Ya, Tutup",
            danger: false,
            isShow: true,
        })
    }

    const handleConfirmation = () => {
        let url = "pickup.save_manifest_serah";
        if (role === "Warehouse") {
            url = "warehouse.save_manifest_serah";
        }
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
            <Head title="Delivery - Delivery Order" />

            <PageLayout title='Delivery Order' description="Kelola pengiriman barang">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <DeliveryOrderTable data={datas} onAddButtonClicked={handleAdd} columns={deliveryOrderTableColumns({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete, onTutupManifest })} />
                        <DeliveryOrderFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedData={selectedItemData} isView={isView} />
                        <DOFormDialog selectedData={selectedData} isOpen={tambahData} setIsOpen={setTambahData} isView={true} />
                        <ConfirmationDialog
                            title={confirmation.title}
                            subtitle={confirmation.subtitle}
                            message={confirmation.message}
                            label={confirmation.label}
                            danger={confirmation.danger}
                            isOpen={confirmation.isShow}
                            isLoading={processing}
                            onOpenChange={(open) =>
                                setConfirmation((prev) => ({
                                    ...prev,
                                    isShow: open,
                                }))
                            }
                            onConfirm={handleConfirmation} />
                        <DeleteConfirmation
                            title='Hapus Data'
                            subtitle='Proses penghapusan data'
                            message='Apakah Anda yakin akan menghapus data'
                            isOpen={showConfirm}
                            isLoading={processing}
                            onOpenChange={setShowConfirm}
                            onConfirm={handleDelete} />
                    </div>
                </div>
            </PageLayout>
        </AppLayout>
    );
}
