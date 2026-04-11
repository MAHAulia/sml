import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { type BreadcrumbItem } from '@/types';
import { BagianTujuan, Kantor, ManifestSerahData } from '@/types/manifest-serah';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ManifestDialog from './dialog';
import ManifestSerahFormDialog from './form-dialog';
import ManifestSerahTable from './table';
import { manifestSerahTableColumns } from './table-column';


interface ManifestSerahProps {
    datas: ManifestSerahData[],
    kantors: Kantor[],
    bagianTujuans: BagianTujuan[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manifest Serah',
        href: '/Manifest Serah',
    },
];

export default function ManifestSerah({ datas }: ManifestSerahProps) {
    const { delete: destroy, processing } = useForm();

    const [selectedData, setSelectedData] = useState<ManifestSerahData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<ManifestSerahData>()
    const [isOpen, setIsOpen] = useState(false)
    const [tambahData, setTambahData] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('f');

    const handleView = (data: ManifestSerahData) => {
        setIsOpen(true)
        setSelectedData(data)
        setisView(true)
    }

    const handleEdit = (data: ManifestSerahData) => {
        setTambahData(true)
        setSelectedData(data)
        setisView(false)
    }

    const confirmDelete = (data: ManifestSerahData) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
    }

    const handleDelete = () => {
        destroy(route('menu.destroy', deleteMenu?.id));
    }

    const handleAdd = () => {
        setIsOpen(true)
        setSelectedData(null)
        setisView(false)
        // Call API Create Manifest
        // post(route('pickup.save_manifest_serah'), {
        //     onSuccess: () => {
        //         // Open Dialog For add item to manifest
        //         setIsOpen(true)
        //         setSelectedData(null)
        //         setisView(false)
        //     },
        //     onError: (error) => {
        //         console.log(error);
        //     },
        // });

    }

    useEffect(() => {
        if (filter) {
            handleAdd()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pickup - Manifest Serah" />

            <PageLayout title='Manifest Serah' description="Kelola penyerahan barang">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <ManifestSerahTable data={datas} onAddButtonClicked={handleAdd} columns={manifestSerahTableColumns({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete })} />
                        <ManifestSerahFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedData={selectedData} isView={isView} />
                        <ManifestDialog selectedData={selectedData} isOpen={tambahData} setIsOpen={setTambahData} isView={true} />
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
