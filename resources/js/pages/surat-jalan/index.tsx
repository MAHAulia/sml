import ConfirmationDialog from '@/components/confirm-dialog';
import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Kantor, Mobil } from '@/types/manifest-serah';
import { SuratJalanData } from '@/types/surat-jalan';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import SuratJalanDialog from './dialog';
import SuratJalanFormDialog from './form-dialog';
import SuratJalanTable from './table';
import { suratJalanTableColumns } from './table-column';



interface SuratJalanProps {
    datas: SuratJalanData[],
    kantors: Kantor[],
    mobils: Mobil[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Surat Jalan',
        href: '/Surat Jalan',
    },
];

export default function SuratJalan({ datas }: SuratJalanProps) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.roles[0].name;
    const { delete: destroy, post, processing } = useForm();

    const [selectedData, setSelectedData] = useState<SuratJalanData | null>(null)
    const [selectedItemData, setSelectedItemData] = useState<SuratJalanData | null>(null)
    const [deleteMenu, setDeleteMenu] = useState<SuratJalanData>()
    const [isOpen, setIsOpen] = useState(false)
    const [tambahData, setTambahData] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)
    const [confirmation, setConfirmation] = useState({
        title: "",
        subtitle: "",
        message: "",
        action: "",
        label: "",
        danger: false,
        isShow: false,
    })

    const [selectedItem, setSelectedItem] = useState<SuratJalanData | null>(null);
    const [openPreview, setOpenPreview] = useState(false);

    const handleSelectItem = (item: SuratJalanData) => {
        setSelectedItem(item);
        setOpenPreview(true);
    };
 

    const params = new URLSearchParams(window.location.search);
    const filter = params.get('f');

    const handleView = (data: SuratJalanData) => {
        setIsOpen(true)
        setSelectedItemData(data)
        setisView(true)
    }

    const handleEdit = (data: SuratJalanData) => {
        setTambahData(true)
        setSelectedData(data)
        setisView(false)
    }

    const confirmDelete = (data: SuratJalanData) => {
        setDeleteMenu(data)
        setShowConfirm(true)
        setisView(false)
        setSelectedData(data)
    }

    const handleDelete = () => {
        let url = "pickup.save_manifest_serah";
        if (role === "Warehouse") {
            url = "warehouse.save_manifest_serah";
        }
        post(route(url, { a: 'delete', m: selectedData?.code }), {
            onSuccess: () => {
                setShowConfirm(false)
            },
            onError: (error) => {
                console.log(error);
            },
        });
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

    const onTutupManifest = (data: SuratJalanData) => {
        setSelectedData(data)
        setConfirmation({
            title: "Tutup Surat Jalan",
            subtitle: "Proses Tutup Surat Jalan",
            message: "Apakah Anda yakin ingin menutup surat jalan, untuk proses berikutnya",
            action: "approve",
            label: "Ya, Tutup",
            danger: false,
            isShow: true,
        })
    }

    const handleConfirmation = () => {
        const url = "warehouse.save_surat_jalan";
        
        post(route(url, { a: 'approval', m: selectedData?.code }), {
            onSuccess: () => {
                setShowConfirm(false)
                setConfirmation({
                    title: "",
                    subtitle: "",
                    message: "",
                    action: "",
                    label: "",
                    danger: false,
                    isShow: false,
                })
            },
            onError: (error) => {
                console.log(error);
            },
        });
    }


    const onPrint = (data: SuratJalanData) => {
        const url = route('print_surat_jalan', { code: data.code });
        window.open(url, '_blank');
    }
    useEffect(() => {
        if (filter) {
            handleAdd()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pickup - Surat Jalan" />

            <PageLayout title='Surat Jalan' description="Kelola manifest angkutan">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <SuratJalanTable data={datas} onAddButtonClicked={handleAdd} columns={suratJalanTableColumns({ onView: handleView, onEdit: handleEdit, onDelete: confirmDelete, onTutupManifest: onTutupManifest, onPrint: onPrint })} />
                        <SuratJalanFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedData={selectedItemData} isView={isView} />
                        <SuratJalanDialog selectedData={selectedData} isOpen={tambahData} setIsOpen={setTambahData} isView={true} />
                        <ConfirmationDialog
                            title={confirmation.title}
                            subtitle={confirmation.subtitle}
                            message={confirmation.message}
                            label={confirmation.label}
                            danger={confirmation.danger}
                            isOpen={confirmation.isShow}
                            isLoading={processing}
                            onOpenChange={(open) =>
                                setConfirmation((prev) => ({
                                    ...prev,
                                    isShow: open,
                                }))
                            }
                            onConfirm={handleConfirmation} />
                        <DeleteConfirmation
                            title='Hapus Data'
                            subtitle='Proses penghapusan data'
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
