import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { menuTableColumn } from './table-column';
import { useEffect, useState } from 'react';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import { Offerings } from '@/types/marketing';
import { CustomerData } from '@/types/customer';
import OfferingTable from './table';
import OfferingFormDialog from './form-dialog';


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

    const [selectedMenu, setSelectedMenu] = useState<Offerings | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<Offerings>()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('f');

    const handleView = (data: Offerings) => {
        setIsOpen(true)
        setSelectedMenu(data)
        setisView(true)
    }

    const handleEdit = (data: Offerings) => {
        setIsOpen(true)
        setSelectedMenu(data)
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
        setSelectedMenu(null)
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
                        <OfferingTable data={datas} onAddButtonClicked={handleAdd} columns={menuTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <OfferingFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedOffer={selectedMenu} isView={isView} />
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
