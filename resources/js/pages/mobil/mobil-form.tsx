
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobilData } from "@/types";
import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";

type MobilForm = {
    nopol: string;
    merek: string;
    description: string;
    action?: string;
}

interface MobilProps {
    mobil?: MobilData;
}
export default function MobilForm({ mobil }: MobilProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<MobilForm>>({
        nopol: '',
        merek: '',
        description: '',
        action: 'add'
    });

    useEffect(() => {
        if (mobil != null) {
            setData("nopol", mobil.nopol)
            setData("merek", mobil.merek)
            setData("description", mobil.description ?? "")
            setData("action", "update")
        }
    }, [mobil])

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action)
        if (data.action == "add") {
            post(route('mobil.store'), {
                onSuccess: () => {
                    resetForm()
                },
                onError: (error) => {
                    console.log(error)
                }
            });
        }

        if (data.action == "update") {
            put(route('mobil.update', mobil?.id), {
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
        reset('nopol');
        reset('merek');
        reset('description');
        reset('action');
    }
    return (
        <div>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nomor Polisi</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.nopol}
                            onChange={(e) => setData('nopol', e.target.value)}
                            placeholder="Contoh: AB 123 DEF"
                        />
                        <InputError message={errors.nopol} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="merek">Merek</Label>
                        <Input
                            id="merek"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="merek"
                            value={data.merek}
                            onChange={(e) => setData('merek', e.target.value)}
                            placeholder="contoh: Suzuki"
                        />
                        <InputError message={errors.merek} />
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
                            placeholder="Contoh: mobil angkutan"
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