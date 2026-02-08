import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleData } from "@/types";

interface RoleInfoDialog {
    role?: RoleData;
    isOpen: boolean;
    setIsOpen: (open:boolean) => void;
}

export default function RoleInfoDialog({ role, isOpen, setIsOpen }: RoleInfoDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>Detail Role/Peran</DialogTitle>
                    <DialogDescription>
                        Informasi detail role/peran
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nama
                        </Label>
                        <Input id="name" value={role?.name} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deskripsi" className="text-right">
                            Deskripsi
                        </Label>
                        <Input id="deskripsi" value={role?.description || ""} className="col-span-3" disabled readOnly />
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