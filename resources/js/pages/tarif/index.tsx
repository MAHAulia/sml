import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { tarifTableColumn } from './table-column';
import { useEffect, useState } from 'react';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import { Offerings } from '@/types/marketing';
import { CustomerData } from '@/types/customer';
import OfferingTable from './table';
import OfferingFormDialog from './form-dialog';
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

    const { delete: destroy, processing } = useForm();

    const [selectedOffering, setSelectedOffering] = useState<Offerings | null>(null)
    const [deleteOffering, setDeleteOffering] = useState<Offerings>()
    const [isOpen, setIsOpen] = useState(false)
    const [tarifOpen, setTarifOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)

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

    const handleDelete = () => {
        destroy(route('menu.destroy', selectedOffering?.id));
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
                        <TarifDialog selectedOffer={selectedOffering} isOpen={tarifOpen} setIsOpen={setTarifOpen} isView={true} />
                        <DeleteConfirmation
                            title='Hapus Data Menu'
                            subtitle='Proses penghapusan data Menu'
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
