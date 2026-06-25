import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { KantorData, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import KantorForm from './kantor-form';
import MobilInfoDialog from './kantor-info-dialog';
import MobilTable from './kantor-table';
import { kantorTableColumn } from './kantor-table-column';


interface KantorProps {
    kantors: KantorData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kantor',
        href: '/kantor',
    },
];

export default function Mobil({ kantors }: KantorProps) {
    const {delete: destroy, processing } = useForm();

    const [kantor, setKantor] = useState<KantorData>()
    const [deleteRole, setDeleteRole] = useState<KantorData>()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleView = (data: KantorData) => {
        setIsOpen(true)
        setKantor(data)
    }

    const handleEdit = (data: KantorData) => {
        setKantor(data)
    }

    const confirmDelete = (data: KantorData) => {
        setDeleteRole(data)
        setShowConfirm(true)
    }

    const handleDelete = () => {
        destroy(route('kantor.destroy', deleteRole?.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kantor" />

            <PageLayout title='Kantor' description="Kelola data Kantor Anda">
                <div className="space-y-6 flex flex-col lg:flex-row">
                    <div className="lg:flex-1/4 md:flex-1/3 mr-2">
                        <KantorForm kantor={kantor} />
                    </div>
                    <div className="lg:flex-3/4 md:flex-2/3 ml-2">
                        <MobilTable data={kantors} columns={kantorTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <MobilInfoDialog isOpen={isOpen} kantor={kantor} setIsOpen={setIsOpen} />
                        <DeleteConfirmation
                            title='Hapus Data Kantor'
                            subtitle='Proses penghapusan data Kantor'
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
