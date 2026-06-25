
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextArea } from "@/components/ui/textarea";
import { KantorData } from "@/types";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

type KantorForm = {
    code: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    action?: string;
}

interface KantorProps {
    kantor?: KantorData;
}
export default function KantorForm({ kantor }: KantorProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<KantorForm>>({
        code: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        action: 'add'
    });

    useEffect(() => {
        if (kantor != null) {
            setData("code", kantor.code)
            setData("name", kantor.name)
            setData("phone", kantor.phone ?? "")
            setData("email", kantor.email ?? "")
            setData("address", kantor.address ?? "")
            setData("action", "update")
        }
    }, [kantor])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action)
        if (data.action == "add") {
            post(route('kantor.store'), {
                onSuccess: () => {
                    resetForm()
                },
                onError: (error) => {
                    console.log(error)
                }
            });
        }

        if (data.action == "update") {
            put(route('kantor.update', kantor?.id), {
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
        reset('code');
        reset('name');
        reset('phone');
        reset('email');
        reset('address');
        reset('action');
    }
    return (
        <div>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="code">Kode Kantor</Label>
                        <Input
                            id="code"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="Contoh: ABCABC"
                        />
                        <InputError message={errors.code} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Kantor</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={2}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="contoh: Suzuki"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Nomor Telefon</Label>
                        <Input
                            id="phone"
                            type="tel"
                            tabIndex={3}
                            autoComplete="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Contoh: kantor angkutan"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            tabIndex={4}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Contoh: kantor angkutan"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Alamat</Label>
                        <TextArea
                            id="address"
                            tabIndex={5}
                            autoComplete="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Contoh: kantor angkutan"
                        />
                        <InputError message={errors.address} />
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