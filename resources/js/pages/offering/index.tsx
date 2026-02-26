import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { offeringTableColumn } from './table-column';
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
        title: 'Marketing',
        href: '/Marketing',
    },
];

export default function Marketing({ datas }: OfferingProps) {

    console.log('datas', datas)
    const { delete: destroy, processing } = useForm();

    const [selectedOffering, setSelectedOffering] = useState<Offerings | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<Offerings>()
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

    const handleEdit = (data: Offerings) => {
        setIsOpen(true)
        setSelectedOffering(data)
        setisView(false)
    }

    const handleSetTarif = (data: Offerings) => {
        setTarifOpen(true)
        setSelectedOffering(data)
        setisView(false)
    }

    const confirmDelete = (data: Offerings) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
    }

    const handleDelete = () => {
        destroy(route('menu.destroy', deleteMenu?.id));
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
            <Head title="Marketing - Offering" />

            <PageLayout title='Offering' description="Kelola data penawaran ke Customer Anda">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <OfferingTable data={datas} onAddButtonClicked={handleAdd} columns={offeringTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete, onSetTarif: handleSetTarif })} />
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
