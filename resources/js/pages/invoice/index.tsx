import ConfirmationDialog from '@/components/confirm-dialog';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ManifestDialog from './dialog';
import ManifestTerimaFormDialog from './form-dialog';
import ManifestTerimaTable from './table';
import { manifestTerimaTableColumns } from './table-column';
import { InvoiceData } from '@/types/invoice';


interface InvoiceProps {
    datas: InvoiceData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice',
        href: '/invoice',
    },
];

export default function Invoice({ datas }: InvoiceProps) {
    const { delete: destroy, post, processing } = useForm();

    const [selectedData, setSelectedData] = useState<InvoiceData | null>(null)
    const [selectedDataManifest, setSelectedDataManifest] = useState<InvoiceData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<InvoiceData>()
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

    const handleView = (data: InvoiceData) => {
        setIsOpen(true)
        setSelectedData(data)
        setisView(true)
    }

    const handleEdit = (data: InvoiceData) => {
        // setTambahData(true)
        // setSelectedData(data)
        // setisView(false)
    }

    const confirmDelete = (data: InvoiceData) => {

    }

    const handleDelete = () => {
        // post(route('pickup.save_manifest_serah', { a: 'delete', m: selectedData?.code }), {
        //     onSuccess: () => {
        //         setShowConfirm(false)
        //     },
        //     onError: (error) => {
        //         console.log(error);
        //     },
        // });
    }

    const handleAdd = () => {
        // setIsOpen(true)
        // setSelectedData(null)
        // setisView(false)
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

    const onTutupManifest = (data: InvoiceData) => {
        setSelectedDataManifest(data)
        setTambahData(true)
        setisView(false)
    }

    const handleConfirmation = () => {
        post(route('pickup.save_manifest_serah', { a: 'approval', m: selectedData?.no_invoice }), {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pickup - Invoice" />

            <PageLayout title='Invoice' description="Kelola data invoice Anda">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <ManifestTerimaTable data={datas ?? []} columns={manifestTerimaTableColumns({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete, onTutupManifest })} />
                        <ManifestTerimaFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedData={selectedData} isView={isView} />
                        <ManifestDialog selectedData={selectedDataManifest ?? null} isOpen={tambahData} setIsOpen={setTambahData} isView={true} />
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
