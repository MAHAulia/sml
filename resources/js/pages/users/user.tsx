import { Head, useForm } from '@inertiajs/react';
import { RoleData, UserData, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { userTableColumn } from './user-table-column';
import UserTable from './user-table';
import UserForm from './user-form';
import { useState } from 'react';
import UserInfoDialog from './user-info-dialog';
import DeleteConfirmation from '@/components/delete-confirm-dialog';


interface UserProps {
    users: UserData[],
    roles: RoleData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengguna',
        href: '/pengguna',
    },
];

export default function User({ users, roles }: UserProps) {
    const {delete: destroy, put, processing } = useForm();

    const [user, setUser] = useState<UserData>()
    const [deleteUser, setUserDelete] = useState<UserData>()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleView = (user: UserData) => {
        setIsOpen(true)
        setUser(user)
    }

    const handleEdit = (user: UserData) => {
        setUser(user)
    }

    const confirmDelete = (user: UserData) => {
        setUserDelete(user)
        setShowConfirm(true)
    }

    const handleDelete = () => {
        destroy(route('pengguna.destroy', deleteUser?.id));
    }

    const handleResendVerify = (user: UserData) => {
        put(route('pengguna.verify-resend', user.id))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />

            <PageLayout title='Pengguna' description="Kelola data pengguna Anda">
                <div className="space-y-6 flex flex-col lg:flex-row">
                    <div className="lg:flex-1/4 md:flex-1/3 mr-2">
                        <UserForm roles={roles} user={user} />
                    </div>
                    <div className="lg:flex-3/4 md:flex-2/3 ml-2">
                        <UserTable data={users} columns={userTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete, onResendVerify: handleResendVerify })} />
                        <UserInfoDialog isOpen={isOpen} user={user} setIsOpen={setIsOpen} />
                        <DeleteConfirmation
                            title='Hapus Data Pengguna'
                            subtitle='Proses penghapusan data pengguna'
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
