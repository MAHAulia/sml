
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleData } from "@/types";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

type RoleForm = {
    name: string;
    description: string;
    action?: string;
}

interface RoleProps {
    role?: RoleData;
}
export default function RoleForm({ role }: RoleProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<RoleForm>>({
        name: '',
        description: '',
        action: 'add'
    });

    useEffect(() => {
        if (role != null) {
            setData("name", role.name)
            setData("description", role.description ?? "")
            setData("action", "update")
        }
    }, [role])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action)
        if (data.action == "add") {
            post(route('role.store'), {
                onSuccess: () => {
                    resetForm()
                },
                onError: (error) => {
                    console.log(error)
                }
            });
        }

        if (data.action == "update") {
            put(route('role.update', role?.id), {
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
        reset('description');
        reset('action');
    }
    return (
        <div>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Role / Peran</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Tukan Ketik"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Input
                            id="description"
                            type="text"
                            tabIndex={2}
                            autoComplete="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Email"
                        />
                        <InputError message={errors.description} />
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