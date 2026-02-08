
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoleData, UserData } from "@/types";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

type PenggunaForm = {
    name: string;
    email: string;
    role: string;
    action?: string;
}

interface PenggunaProps {
    roles: RoleData[];
    user?: UserData;
}
export default function UserForm({ roles, user }: PenggunaProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<PenggunaForm>>({
        name: '',
        email: '',
        role: '',
        action: 'add'
    });

    useEffect(() => {
        if (user != null) {
            setData("name", user.name)
            setData("email", user.email)
            setData("role", user.role_id != null ? user.role_id.toString() : "")
            setData("action", "update")
        }
    }, [user])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action)
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