import { Head, useForm } from '@inertiajs/react';
import {type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { menuTableColumn } from './table-column';
import { useEffect, useState } from 'react';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import { CustomerData } from '@/types/customer';
import CustomerTable from './table';
import CustomerFormDialog from './form-dialog';


interface CustomerProps {
    datas: CustomerData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
];

export default function Customer({ datas }: CustomerProps) {
    const { delete: destroy, processing } = useForm();

    const [selectedMenu, setSelectedMenu] = useState<CustomerData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<CustomerData>()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('f');

    const handleView = (data: CustomerData) => {
        setIsOpen(true)
        setSelectedMenu(data)
        setisView(true)
    }

    const handleEdit = (data: CustomerData) => {
        setIsOpen(true)
        setSelectedMenu(data)
        setisView(false)
    }

    const confirmDelete = (data: CustomerData) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
    }

    const handleDelete = () => {
        destroy(route('customer.destroy', deleteMenu?.id));
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
    },[])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marketing - Customer" />

            <PageLayout title='Customer' description="Kelola data Customer Anda">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <CustomerTable data={datas} onAddButtonClicked={handleAdd} columns={menuTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <CustomerFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedMenu={selectedMenu} isView={isView} withParam={filter} />
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
