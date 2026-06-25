import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { MobilData, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MobilForm from './mobil-form';
import RoleInfoDialog from './mobil-info-dialog';
import MobilTable from './mobil-table';
import { mobilTableColumn } from './mobil-table-column';


interface MobilProps {
    mobils: MobilData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mobil',
        href: '/mobil',
    },
];

export default function Mobil({ mobils }: MobilProps) {
    const {delete: destroy, processing } = useForm();

    const [mobil, setMobil] = useState<MobilData>()
    const [deleteRole, setDeleteRole] = useState<MobilData>()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleView = (data: MobilData) => {
        setIsOpen(true)
        setMobil(data)
    }

    const handleEdit = (data: MobilData) => {
        setMobil(data)
    }

    const confirmDelete = (data: MobilData) => {
        setDeleteRole(data)
        setShowConfirm(true)
    }

    const handleDelete = () => {
        destroy(route('mobil.destroy', deleteRole?.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mobil" />

            <PageLayout title='Mobil' description="Kelola data Mobil Anda">
                <div className="space-y-6 flex flex-col lg:flex-row">
                    <div className="lg:flex-1/4 md:flex-1/3 mr-2">
                        <MobilForm mobil={mobil} />
                    </div>
                    <div className="lg:flex-3/4 md:flex-2/3 ml-2">
                        <MobilTable data={mobils} columns={mobilTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <RoleInfoDialog isOpen={isOpen} mobil={mobil} setIsOpen={setIsOpen} />
                        <DeleteConfirmation
                            title='Hapus Data Mobil'
                            subtitle='Proses penghapusan data Mobil'
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
