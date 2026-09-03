
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobilData, OfficeData, RoleData, UserData } from "@/types";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

type PenggunaForm = {
    name: string;
    email: string;
    role: string;
    action?: string;
    nopolId?: string;
    office: string;
}

interface PenggunaProps {
    roles: RoleData[];
    mobils: MobilData[];
    offices: OfficeData[];
    user?: UserData;
}
export default function UserForm({ roles, user, mobils, offices }: PenggunaProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<PenggunaForm>>({
        name: '',
        email: '',
        role: '',
        nopolId: '',
        office: '',
        action: 'add'
    });

    useEffect(() => {
        if (user != null) {
            console.log("user", user)
            setData("name", user.name)
            setData("email", user.email)
            setData("role", user.role_id != null ? user.role_id.toString() : "")
            setData("nopolId", user.mobil_id != null ? user.mobil_id.toString() : "")
            setData("office", user.office != null ? user.office.toString() : "")
            setData("action", "update")
        }
    }, [user])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data)
        if (data.action == "add") {
            post(route('pengguna.store'), {
                onSuccess: () => {
                    resetForm()
                },
                onError: (error) => {
                    console.log(error)
                }
            });
        }

        if (data.action == "update") {
            put(route('pengguna.update', user?.id), {
                onSuccess: () => {
                    resetForm()
                },
                onError: (error) => {
                    console.log(error)
                }
            });
        }
    };

    const resetForm = () => {
        reset('name');
        reset('email');
        reset('role');
        reset('action');
        reset('nopolId');
        reset('office');
    }
    return (
        <div>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Pengguna</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Fulan bin Fulan"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Pengguna</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role Pengguna</Label>
                        <Select value={data.role} onValueChange={(value) => setData("role", value)} defaultValue={data.role} required>
                            <SelectTrigger id="role" tabIndex={3} className="w-full">
                                <SelectValue placeholder="Pilih peran Pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role Pengguna</SelectLabel>
                                    {roles.map(role => <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="office">Kantor</Label>
                        <Select value={data.office} onValueChange={(value) => setData("office", value)} defaultValue={data.office} required>
                            <SelectTrigger id="office" tabIndex={4} className="w-full">
                                <SelectValue placeholder="Pilih peran Pengguna" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>office Pengguna</SelectLabel>
                                    {offices.map(office => <SelectItem key={office.id} value={office.code.toString()}>{office.name}</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.office} />
                    </div>
                    {data.role == '10' && <div className="grid gap-2">
                        <Label htmlFor="nopol">Nomor Polisi</Label>
                        <Select value={data.nopolId} onValueChange={(value) => setData("nopolId", value)} defaultValue={data.nopolId} required>
                            <SelectTrigger id="nopol" tabIndex={5} className="w-full">
                                <SelectValue placeholder="Pilih Mobil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Nomor Polisi Mobil</SelectLabel>
                                    {mobils.map(mobil => <SelectItem key={mobil.id} value={mobil.id.toString()} disabled={mobil.sopir != null}>{mobil.nopol} - {mobil.merek} {mobil.sopir != null ? '[ASSIGNED]' : '' }</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.nopolId} />
                    </div>}

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Simpan
                    </Button>
                    <Button variant="outline" type="reset" className="w-full" tabIndex={5} disabled={processing} onClick={() => resetForm()}>
                        Batal
                    </Button>
                </div>

                {/* <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div> */}
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </div>
    )
}