import DeleteConfirmation from '@/components/delete-confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { UserData, type BreadcrumbItem } from '@/types';
import { Offerings } from '@/types/marketing';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import OfferingFormDialog from './form-dialog';
import PickupDialog from './pickup-dialog';
import OfferingTable from './table';
import { offeringTableColumn } from './table-column';


interface OfferingProps {
    datas: Offerings[],
    pickuper: UserData[],
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pickup',
        href: '/pickup',
    }
];

export default function Marketing({ datas }: OfferingProps) {
    const { processing } = useForm();

    const [selectedOffering, setSelectedOffering] = useState<Offerings | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [tarifOpen, setTarifOpen] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isView, setisView] = useState(false)


    const handleView = (data: Offerings) => {
        setIsOpen(true)
        setSelectedOffering(data)
        setisView(true)
    }

    const onRequestPickup = (data: Offerings) => {
        setTarifOpen(true)
        setSelectedOffering(data)
        setisView(false)
    }

    const onViewLocation = (data: Offerings) => {
        console.log(data.receiverAddress)
        const query = encodeURIComponent(data.receiverAddress);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, "_blank");
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Services - Pickup Request" />

            <PageLayout title='Pickup Request' description="Kelola permintaan pickup">
                <div className="space-y-6 flex">
                    <div className="w-full ml-2">
                        <OfferingTable data={datas} columns={offeringTableColumn({ onView: handleView, onRequestPickup, onViewLocation })} />
                        <OfferingFormDialog isOpen={isOpen} setIsOpen={setIsOpen} selectedOffer={selectedOffering} isView={isView} />
                        <PickupDialog selectedOffer={selectedOffering} isOpen={tarifOpen} setIsOpen={setTarifOpen} isView={true} />
                        <DeleteConfirmation
                            title='Hapus Data Menu'
                            subtitle='Proses penghapusan data Menu'
                            message='Apakah Anda yakin akan menghapus data'
                            isOpen={showConfirm}
                            isLoading={processing}
                            onOpenChange={setShowConfirm}
                            onConfirm={()=>{}} />
                    </div>
                </div>
            </PageLayout>
        </AppLayout>
    );
}
