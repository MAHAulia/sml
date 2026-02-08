import { Head, useForm } from '@inertiajs/react';
import { MenuData, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { menuTableColumn } from './menu-table-column';
import { useState } from 'react';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import MenuTable from './menu-table';
import MenuFormDialog from './menu-form-dialog';


interface MenuProps {
    listMenu: MenuData[],
    parentMenu: MenuData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '/menu',
    },
];

export default function Menu({ listMenu: menus }: MenuProps) {
    const { delete: destroy, processing } = useForm();

    const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<MenuData>()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)

    const handleView = (data: MenuData) => {
        setIsOpen(true)
        setSelectedMenu(data)
        setisView(true)
    }

    const handleEdit = (data: MenuData) => {
        setIsOpen(true)
        setSelectedMenu(data)
        setisView(false)
    }

    const confirmDelete = (data: MenuData) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu" />

            <PageLayout title='Menu' description="Kelola data menu Anda">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <MenuTable data={menus} onAddButtonClicked={handleAdd} columns={menuTableColumn({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <MenuFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedMenu={selectedMenu} isView={isView} />
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
