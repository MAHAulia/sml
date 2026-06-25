import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KantorData } from "@/types";

interface KantorInfoDialog {
    kantor?: KantorData;
    isOpen: boolean;
    setIsOpen: (open:boolean) => void;
}

export default function KantorInfoDialog({ kantor, isOpen, setIsOpen }: KantorInfoDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>Detail Kantor</DialogTitle>
                    <DialogDescription>
                        Informasi detail Kantor
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                            Kode Kantor
                        </Label>
                        <Input id="code" value={kantor?.code} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            name
                        </Label>
                        <Input id="name" value={kantor?.name} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            address
                        </Label>
                        <Input id="address" value={kantor?.address || ""} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            phone
                        </Label>
                        <Input id="phone" value={kantor?.phone || ""} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            email
                        </Label>
                        <Input id="email" value={kantor?.email || ""} className="col-span-3" disabled readOnly />
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