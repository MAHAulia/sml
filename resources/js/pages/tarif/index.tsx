import ConfirmationDialog from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { type BreadcrumbItem } from '@/types';
import { CustomerData } from '@/types/customer';
import { Offerings } from '@/types/marketing';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import OfferingFormDialog from './form-dialog';
import OfferingTable from './table';
import { tarifTableColumn } from './table-column';
import TarifDialog from './tarif-dialog';


interface OfferingProps {
    datas: Offerings[],
    customers: CustomerData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounting',
        href: '/tarif',
    },
];

export default function Marketing({ datas }: OfferingProps) {

    const { delete: destroy, put, processing } = useForm();

    const [selectedOffering, setSelectedOffering] = useState<Offerings | null>(null)
    const [deleteOffering, setDeleteOffering] = useState<Offerings>()
    const [isOpen, setIsOpen] = useState(false)
    const [tarifOpen, setTarifOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)
    const [confirmation, setConfirmation] = useState({
        title: "",
        subtitle: "",
        message: "",
        action: "",
        label: "",
        danger: false,
    })

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('f');

    const handleView = (data: Offerings) => {
        setIsOpen(true)
        setSelectedOffering(data)
        setisView(true)
    }

    const handleSetTarif = (data: Offerings) => {
        setTarifOpen(true)
        setSelectedOffering(data)
        setisView(false)
    }

    const confirmDelete = (data: Offerings) => {
        // setDeleteOffering(data)
        // setShowConfirm(true)
        // setisView(false)
    }

    const handleConfirmation = () => {
        console.log({id: selectedOffering?.id, state: confirmation.action})
        put(route('tarif.create', {id: selectedOffering?.id, state: confirmation.action}), {
            onSuccess: () => {
                if (tarifOpen) {
                    setTarifOpen(false)
                }
                setConfirmation({
                    title: "",
                    subtitle: "",
                    message: "",
                    action: "",
                    label: "",
                    danger: false,
                })
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }

    const handleAdd = () => {
        setIsOpen(true)
        setSelectedOffering(null)
        setisView(false)
    }

    useEffect(() => {
        if (filter) {
            handleAdd()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounting - Tarif" />

            <PageLayout title='Tarif' description="Kelola penentuan biaya penawaran layanan">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <OfferingTable data={datas} columns={tarifTableColumn({ onView: handleView, onEdit: handleSetTarif, onDelete: confirmDelete })} />
                        <OfferingFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedOffer={selectedOffering} isView={isView} />
                        <TarifDialog
                            selectedOffer={selectedOffering}
                            isOpen={tarifOpen}
                            setIsOpen={setTarifOpen}
                            isView={true}
                            confirmApprove={(data) => {
                                setConfirmation({
                                    title: "Persetujuan Harta",
                                    subtitle: "Approval Penentuan Harga",
                                    message: "Apakah Anda yakin ingin melakukan approval harga?",
                                    action: "approve",
                                    label: "Ya, Terima",
                                    danger: false,
                                })
                                setShowConfirm(true)
                            }}
                            confirmReject={(data) => {
                                setConfirmation({
                                    title: "Persetujuan Harga",
                                    subtitle: "Tolak Penentuan Harga",
                                    message: "Apakah Anda yakin ingin melakukan penolakan harga?",
                                    action: "reject",
                                    label: "Ya, Tolak!",
                                    danger: true,
                                })
                                setShowConfirm(true)
                            }} />
                        <ConfirmationDialog
                            title={confirmation.title}
                            subtitle={confirmation.subtitle}
                            message={confirmation.message}
                            label={confirmation.label}
                            danger={confirmation.danger}
                            isOpen={showConfirm}
                            isLoading={processing}
                            onOpenChange={setShowConfirm}
                            onConfirm={handleConfirmation} />
                    </div>
                </div>
            </PageLayout>
        </AppLayout>
    );
}
