import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { type BreadcrumbItem } from '@/types';
import { BagianTujuan, Kantor, ManifestSerahData } from '@/types/manifest-serah';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '@/components/confirm-dialog';
import BaggingTable from './table';
import BaggingFormDialog from './form-dialog';
import BagingFormDialog from './dialog';
import { bagingTableColumns } from './table-column';
import { BagingData } from '@/types/baging';


interface BaggingProps {
    datas: BagingData[],
    kantors: Kantor[],
    bagianTujuans: BagianTujuan[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kantong',
        href: '/Kantong',
    },
];

export default function ManifestSerah({ datas }: BaggingProps) {
    const { delete: destroy, post, processing } = useForm();

    const [selectedData, setSelectedData] = useState<BagingData | null>(null)
    const [selectedViewData, setSelectedViewData] = useState<BagingData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<BagingData>()
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

    const handleView = (data: BagingData) => {
        setIsOpen(true)
        setSelectedViewData(data)
        setisView(true)
    }

    const onEdit = (data: BagingData) => {
        setTambahData(true)
        setSelectedData(data)
        setisView(false)
    }

    const confirmDelete = (data: BagingData) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
        setSelectedData(data)
    }

    const handleDelete = () => {
        post(route('warehouse.create_baging', { a: 'delete', m: selectedData?.code }), {
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

    const onTutupManifest = (data: BagingData) => {
        setSelectedData(data)
        setConfirmation({
            title: "Tutup Kantong",
            subtitle: "Proses Tutup Kantong",
            message: "Apakah Anda yakin ingin menutup kantong, untuk proses berikutnya",
            action: "approve",
            label: "Ya, Tutup",
            danger: false,
            isShow: true,
        })
    }

    const handleConfirmation = () => {
        post(route('warehouse.create_baging', { a: 'approval', m: selectedData?.code }), {
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
            <Head title="Warehouse - Bagging" />

            <PageLayout title='Baging' description="Kelola proses bagging">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <BaggingTable data={datas} onAddButtonClicked={handleAdd} columns={bagingTableColumns({ onView: handleView, onEdit, onDelete: confirmDelete, onTutupManifest })} />
                        <BaggingFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedData={selectedViewData} isView={isView} />
                        <BagingFormDialog selectedData={selectedData} isOpen={tambahData} setIsOpen={setTambahData} isView={true} />
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
