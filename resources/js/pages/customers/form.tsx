import ErrorBoundary from '@/components/error-boundary';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MenuData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LoaderCircle, Check, ChevronsUpDown } from 'lucide-react';
import { createElement, FormEventHandler, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type MenuForm = {
    label: string;
    route_name: string;
    icon: string;
    type: string;
    is_parent: boolean;
    parent_id: string;
    orderNumber: number;
    action: string;
};

interface MenuProps {
    selectedMenu?: MenuData | null;
    onOpenChange?(open: boolean): void;
}

export default function MenuForm({ selectedMenu, onOpenChange }: MenuProps) {
    const [isIconOpen, setIsIconOpen] = useState(false);
    const page = usePage();
    const parentMenu = page.props.parentMenu as MenuData[];
    const { data, setData, post, put, processing, errors, reset } = useForm<Required<MenuForm>>({
        label: '',
        route_name: '',
        icon: '',
        type: 'menu',
        is_parent: true,
        parent_id: '',
        orderNumber: 0,
        action: 'add',
    });

    const excludedIcons = ["createLucideIcon", "Icons"]; // list all keys you want to exclude

    const iconNames = Icons
        ? (Object.keys(Icons) as (keyof typeof Icons)[])
            .filter(name => !excludedIcons.includes(name))
            .sort()
        : [];

    useEffect(() => {
        if (selectedMenu != null) {
            console.log("menu.type from props:", selectedMenu.type);
            console.log("menu.icon from props:", selectedMenu.icon);
            console.log("iconNames includes selectedMenu.icon?", iconNames.includes(selectedMenu.icon as keyof typeof Icons));
            setData('label', selectedMenu.label);
            setData('route_name', selectedMenu.route_name);
            // Safely set icon if it's valid
            if (selectedMenu.icon && iconNames.includes(selectedMenu.icon as keyof typeof Icons)) {
                console.info("set icon", selectedMenu.icon)
                setData('icon', selectedMenu.icon);
            } else {
                console.warn("Invalid or missing icon:", selectedMenu.icon);
            }
            setData('type', selectedMenu.type);
            setData('is_parent', selectedMenu.is_parent);
            setData('parent_id', selectedMenu.parent_id?.toString());
            setData('orderNumber', selectedMenu.order_number ?? 1);
            setData('action', 'update');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenu]);

    setTimeout(() => {
        console.log(data)
    }, 300);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action);
        if (data.action == 'add') {
            post(route('menu.store'), {
                onSuccess: () => {
                    resetForm();
                    if (onOpenChange) {
                        onOpenChange(false);
                    }
                },
                onError: (error) => {
                    console.log(error);
                },
            });
        }

        if (data.action == 'update') {
            put(route('menu.update', selectedMenu?.id), {
                onSuccess: () => {
                    resetForm();
                    if (onOpenChange) {
                        onOpenChange(false);
                    }
                },
                onError: (error) => {
                    console.log(error);
                },
            });
        }
    };

    const resetForm = () => {
        reset('label');
        reset('route_name');
        reset('icon');
        reset('type');
        reset('is_parent');
        reset('parent_id');
        reset('orderNumber');
        reset('action');
    };

    return (
        <div>
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="label">Label</Label>
                        <Input
                            id="label"
                            type="text"
                            required
                            tabIndex={1}
                            autoComplete="label"
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            placeholder="contoh. Laporan Baru"
                        />
                        <InputError message={errors.label} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="route_name">Route Alias {data.route_name}</Label>
                        <Input
                            id="route_name"
                            type="text"
                            tabIndex={2}
                            autoComplete="route_name"
                            value={data.route_name}
                            onChange={(e) => setData('route_name', e.target.value)}
                            placeholder="contoh: report.index"
                        />
                        <InputError message={errors.route_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="icon">Iconsss {data.icon}</Label>
                        <Popover open={isIconOpen} onOpenChange={setIsIconOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isIconOpen}
                                    className="w-full justify-between"
                                    tabIndex={3}
                                >
                                    {data.icon ? (
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const iconName = data.icon as keyof typeof Icons;
                                                const IconComponent = Icons[iconName] as LucideIcon;
                                                if (!IconComponent) return <span className="text-gray-400">Invalid icon</span>;
                                                return (
                                                    <>
                                                        {createElement(IconComponent, { className: "h-4 w-4" })}
                                                        <span>{data.icon}</span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        "Pilih Icon..."
                                    )}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Cari icons..." />
                                    <CommandList>
                                        <CommandEmpty>Tidak ada icon yang ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            <ErrorBoundary>
                                                {iconNames.map((iconName) => {
                                                    const IconComponent = Icons[iconName] as LucideIcon;
                                                    const isValidIcon = 
                                                        typeof IconComponent === "function" ||
                                                        (typeof IconComponent === "object" && IconComponent !== null && "render" in IconComponent);

                                                    if (!isValidIcon) return null;

                                                    return (
                                                        <CommandItem
                                                            key={iconName}
                                                            value={iconName}
                                                            onSelect={(currentValue) => {
                                                                setData('icon', currentValue === data.icon ? "" : currentValue);
                                                                setIsIconOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.icon === iconName ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <IconComponent className="h-4 w-4" />
                                                                {iconName}
                                                            </div>
                                                        </CommandItem>
                                                    );
                                                })}
                                            </ErrorBoundary>
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <InputError message={errors.icon} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="is_parent">Jenis Menu {data.is_parent}</Label>
                        <Select
                            value={data.is_parent ? 'MENU UTAMA' : 'MENU ANAK'}
                            onValueChange={(value) => setData('is_parent', value === 'MENU UTAMA')}
                            required
                        >
                            <SelectTrigger id="is_parent" tabIndex={4} className="w-full">
                                <SelectValue placeholder="Menu Utama / Menu Anak" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Jenis Menu</SelectLabel>
                                    <SelectItem value="MENU UTAMA">MENU UTAMA</SelectItem>
                                    <SelectItem value="MENU ANAK">MENU ANAK</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_parent} />
                    </div>

                    {!data.is_parent && (
                        <div className="grid gap-2">
                            <Label htmlFor="parent_id">Menu Induk {data.parent_id}</Label>
                            <Select value={data.parent_id} onValueChange={(value) => setData('parent_id', value)} defaultValue={data.parent_id}>
                                <SelectTrigger id="parent_id" tabIndex={5} className="w-full">
                                    <SelectValue placeholder="Pilih Menu Induk" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Menu Induk</SelectLabel>
                                        {parentMenu.map((menuInduk) => (
                                            <SelectItem key={menuInduk.id} value={menuInduk.id.toString()}>
                                                {menuInduk.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.parent_id} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="role">Tipe Menu {data.type}</Label>
                        <Select value={data.type} onValueChange={(value) => setData('type', value)} defaultValue="MENU" required>
                            <SelectTrigger id="role" tabIndex={6} className="w-full">
                                <SelectValue placeholder="Pilih Tipe Menu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role Pengguna</SelectLabel>
                                    {['menu', 'form', 'api'].map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.toLocaleUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Simpan
                    </Button>
                    <Button variant="outline" type="reset" className="w-full" tabIndex={5} disabled={processing} onClick={() => resetForm()}>
                        Batal
                    </Button>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </div>
    );
}