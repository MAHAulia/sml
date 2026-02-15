import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { MenuData } from "@/types";
import MenuForm from "./form";
import { useForm, usePage } from "@inertiajs/react";
import ErrorBoundary from '@/components/error-boundary';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import { createElement, FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface MenuFormDialog {
    selectedMenu: MenuData | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isView: boolean;
}

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


export default function MenuFormDialog({ selectedMenu, isOpen, setIsOpen, isView = true }: MenuFormDialog) {
    const [selectIsOpen, setSelectIsOpen] = useState(false)
    const filterInputRef = useRef<HTMLInputElement>(null);
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

    const excludedIcons = ["createLucideIcon", "Icons", "default"];


    const iconNames = useMemo(() => {
        return Object.keys(Icons)
            .filter((name) => {
                if (
                    excludedIcons.includes(name) ||
                    name.includes("Icon") // ⛔️ skip semua yang ada kata 'Icon'
                ) {
                    return false;
                }

                const icon = Icons[name as keyof typeof Icons];
                return (
                    typeof icon === "function" ||
                    (typeof icon === "object" && icon !== null && "render" in icon)
                );
            })
            .sort();
    }, [])


    useEffect(() => {

        if (selectedMenu != null) {
            setData('label', selectedMenu.label);
            setData('route_name', selectedMenu.route_name);

            if (selectedMenu.icon && iconNames.includes(selectedMenu.icon as keyof typeof Icons)) {
                setData('icon', selectedMenu.icon);
            }
            setData('type', selectedMenu.type);
            setData('is_parent', selectedMenu.is_parent);
            setData('parent_id', selectedMenu.parent_id?.toString());
            setData('orderNumber', selectedMenu.order_number ?? 1);
            setData('action', 'update');
        } else {
            resetForm()
        }
    }, [selectedMenu]);

    useEffect(() => {
        if (selectIsOpen) {
            filterInputRef.current?.focus();
        }
    }, [selectIsOpen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data.action);
        if (data.action == 'add') {
            post(route('menu.store'), {
                onSuccess: () => {
                    resetForm();
                    if (setIsOpen) {
                        setIsOpen(false);
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
                    if (setIsOpen) {
                        setIsOpen(false);
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[512px]">
                <DialogHeader>
                    <DialogTitle>Penawaran</DialogTitle>
                    <DialogDescription>
                        Formulir data penawaran layanan
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                                        disabled={isView}
                                    />
                                    <InputError message={errors.label} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="route_name">Route Alias</Label>
                                    <Input
                                        id="route_name"
                                        type="text"
                                        tabIndex={2}
                                        autoComplete="route_name"
                                        value={data.route_name}
                                        onChange={(e) => setData('route_name', e.target.value)}
                                        placeholder="contoh: report.index"
                                        disabled={isView}
                                    />
                                    <InputError message={errors.route_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Popover open={selectIsOpen} onOpenChange={setSelectIsOpen} >
                                        <PopoverTrigger asChild className="w-full">
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={selectIsOpen}
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
                                                <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" >
                                            <Command>
                                                <CommandInput placeholder="Cari icons..." />
                                                <CommandList>
                                                    <CommandEmpty>Tidak ada icon yang ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        <ErrorBoundary>
                                                            {Array.isArray(iconNames) && iconNames.length > 0 ? (
                                                                iconNames.map((iconName) => {
                                                                    const IconComponent = Icons[iconName as keyof typeof Icons] as LucideIcon;
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
                                                                                setSelectIsOpen(false);
                                                                            }}
                                                                            className="flex items-center justify-between"
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <IconComponent className="h-4 w-4" />
                                                                                {iconName}
                                                                            </div>
                                                                            <Icons.Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    data.icon === iconName ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="text-muted text-sm p-2">Tidak ada icon ditemukan</div>
                                                            )}
                                                        </ErrorBoundary>
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={errors.icon} />
                                </div>


                                <div className="grid gap-2">
                                    <Label htmlFor="is_parent">Jenis Menu</Label>
                                    <Select
                                        value={data.is_parent ? 'MENU UTAMA' : 'MENU ANAK'}
                                        onValueChange={(value) => setData('is_parent', value === 'MENU UTAMA')}
                                        required
                                        disabled={isView}
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
                                        <Label htmlFor="parent_id">Menu Induk</Label>
                                        <Select value={data.parent_id} onValueChange={(value) => setData('parent_id', value)} defaultValue={data.parent_id} disabled={isView}>
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
                                    <Label htmlFor="role">Tipe Menu</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)} defaultValue="MENU" required disabled={isView}>
                                        <SelectTrigger id="role" tabIndex={6} className="w-full">
                                            <SelectValue placeholder="Pilih Tipe Menu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tipe Menu</SelectLabel>
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

                                {!isView && <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Simpan
                                </Button>}
                                {data.action == "add" && !isView && <Button variant="outline" type="reset" className="w-full" tabIndex={5} disabled={processing} onClick={() => resetForm()}>
                                    Batal
                                </Button>}
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
                </div>
            </DialogContent>
        </Dialog>
    )
}