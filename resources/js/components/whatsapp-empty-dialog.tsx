import { useForm } from "@inertiajs/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

export default function WhatsAppEmptyDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const {get} = useForm()
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Lengkapi Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                        Silahkan lengkapi nomor WhatsApp Anda di halaman profil untuk membagikan formulir.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Nanti Saja</AlertDialogCancel>
                    <AlertDialogAction onClick={() => get(route('profile.edit')) }>Ok, Lengkapi Sekarang</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}