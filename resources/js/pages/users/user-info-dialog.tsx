import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/types";

interface UserInfoDialog {
    user?: UserData;
    isOpen: boolean;
    setIsOpen: (open:boolean) => void;
}

export default function UserInfoDialog({ user, isOpen, setIsOpen }: UserInfoDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>Detail data pengguna</DialogTitle>
                    <DialogDescription>
                        Informasi detail pengguna
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nama Pengguna
                        </Label>
                        <Input id="name" value={user?.name} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" value={user?.email} className="col-span-3" disabled readOnly />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <Input id="role" value={user?.role} className="col-span-3" disabled readOnly />
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