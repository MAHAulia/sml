import { Head, useForm } from '@inertiajs/react';
import { MobilData, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { roleTableColumn } from './mobil-table-column';
import RoleTable from './mobil-table';
import { useState } from 'react';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import RoleInfoDialog from './mobil-info-dialog';
import RoleForm from './mobil-form';


interface MobilProps {
    roles: MobilData[],
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
        destroy(route('role.destroy', deleteRole?.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role/Peran" />

            <PageLayout title='Role/Peran' description="Kelola data role/peran Anda">
                <div className="space-y-6 flex flex-col lg:flex-row">
                    <div className="lg:flex-1/4 md:flex-1/3 mr-2">
                        <RoleForm role={role} />
                    </div>
                    <div className="lg:flex-3/4 md:flex-2/3 ml-2">
                        <RoleTable data={roles} columns={roleTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <RoleInfoDialog isOpen={isOpen} role={role} setIsOpen={setIsOpen} />
                        <DeleteConfirmation
                            title='Hapus Data Role/Peran'
                            subtitle='Proses penghapusan data Role/Peran'
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
