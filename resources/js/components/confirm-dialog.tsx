import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";

interface UserInfoDialog {
    title: string;
    subtitle: string;
    message: string;
    isOpen: boolean;
    isLoading: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (open: boolean) => void;
}

export default function DeleteConfirmation({ title, subtitle, message, isOpen, isLoading, onOpenChange, onConfirm }: UserInfoDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {subtitle}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {message}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Tutup
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" variant="default" className="bg-red-500" onClick={() => onConfirm(true)} disabled={isLoading}>
                            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Hapus
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}