import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon, LoaderCircle } from "lucide-react";

interface AlertDialog {
    title: string;
    subtitle: string;
    message: string;
    isOpen: boolean;
    isLoading: boolean;
    type: string;
    okLabel: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: (open: boolean) => void;
}

export default function AlertDialog({ type, title, subtitle, message, isOpen, isLoading, onOpenChange, onConfirm, okLabel }: AlertDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {type == "info" ? <InfoIcon className="text-blue-500" /> : type == "warning" ? <AlertTriangleIcon className="text-yellow-500" /> : type == "danger" ? <AlertCircleIcon className="text-red-500" /> : null}
                        {title}
                    </DialogTitle>
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
                        <Button type="button" variant="default" className={type == "info" ? "bg-primary" : type == "warning" ? "bg-primary" : type == "danger" ? "bg-red-500" : "bg-primary"} onClick={() => onConfirm(true)} disabled={isLoading}>
                            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {okLabel}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}