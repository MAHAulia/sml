import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobilData } from "@/types";

interface MobilInfoDialog {
    mobil?: MobilData;
    isOpen: boolean;
    setIsOpen: (open:boolean) => void;
}

export default function MobilInfoDialog({ mobil, isOpen, setIsOpen }: MobilInfoDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>Detail Mobil</DialogTitle>
                    <DialogDescription>
                        Informasi detail Mobil
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nopol" className="text-right">
                            Nomor Polisi
                        </Label>
                        <Input id="nopol" value={mobil?.nopol} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="merek" className="text-right">
                            Merek
                        </Label>
                        <Input id="merek" value={mobil?.merek} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deskripsi" className="text-right">
                            Deskripsi
                        </Label>
                        <Input id="deskripsi" value={mobil?.description || ""} className="col-span-3" disabled readOnly />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">
                            Tutup
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}