import ConfirmationDialog from '@/components/confirm-dialog';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { type BreadcrumbItem } from '@/types';
import { InvoiceData } from '@/types/invoice';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InvoiceDialog from './dialog';
import InvoiceFormDialog from './form-dialog';
import InvoiceTable from './table';
import { manifestTerimaTableColumns } from './table-column';


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
    const [selectedDataInvoice, setSelectedDataInvoice] = useState<InvoiceData | null>(null)
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
        setTambahData(true)
        setSelectedData(data)
        setisView(false)
    }

    const confirmDelete = (data: InvoiceData) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
        setSelectedData(data)
    }

    const handleDelete = () => {
        post(route('invoice.store', { action: 'delete', m: selectedData?.no_invoice }), {
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

    const onVerifynSend = (data: InvoiceData) => {
        const url = route('invoice.show', { id: data.no_invoice });
        window.open(url, '_blank');
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
                        <InvoiceTable data={datas ?? []} onAddButtonClicked={handleAdd} columns={manifestTerimaTableColumns({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete, onVerifynSend })} />
                        <InvoiceFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedData={selectedDataInvoice} isView={isView} />
                        <InvoiceDialog selectedData={selectedData ?? null} isOpen={tambahData} setIsOpen={setTambahData} isView={true} />
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
