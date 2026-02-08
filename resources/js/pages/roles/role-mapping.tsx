import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MenuItem } from '@/components/ui/menu-item';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import PageLayout from '@/layouts/page-layout';
import { MenuData, RoleData, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RoleProps {
    menuData: MenuData[];
    role: RoleData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Maping Role to Menu',
        href: '/role/mapping',
    },
];

export default function RoleMapping({ menuData, role }: RoleProps) {
    const {data, setData, put, processing } = useForm({
        menus: []
    })
    
    const [dataMenu, setDataMenu] = useState<MenuData[] | null>(null);
    const [searchUnAssigned, setSearchUnassigned] = useState('');
    const [searchAssigned, setSearchassigned] = useState('');

    useEffect(() => {
        if (menuData) {
            setDataMenu(menuData);
        }
    }, [menuData]);

    const addToAssigned = (data: MenuData) => {
        console.log('assign', data);
        const listDataMenu = dataMenu?.map((assigned) => {
            if (assigned.id == data.id) {
                if (assigned.childs?.length == 0) {
                    assigned.is_mapped = true;
                }
            }
            assigned.childs?.map((child) => {
                if (child.id == data.id) {
                    child.is_mapped = true;
                }
            });

            return assigned;
        }) as MenuData[];

        setDataMenu(listDataMenu);
        setData("menus", listDataMenu as never[])
    };

    const unAssign = (data: MenuData) => {
        console.log('unasign', data);
        const listDataMenu = dataMenu?.map((unasigned) => {
            if (unasigned.id == data.id) {
                if (unasigned.childs?.length == 0) {
                    unasigned.is_mapped = false;
                }
            }

            unasigned.childs?.map((child) => {
                if (child.id == data.id) {
                    child.is_mapped = false;
                }
            });

            return unasigned;
        }) as MenuData[];

        setDataMenu(listDataMenu);
        setData("menus", listDataMenu as never[])
    };

    const assignedMenutoRole = dataMenu
    ?.map((menu) => {
        const matchParent = menu.label.toLowerCase().includes(searchAssigned.toLowerCase()) && menu.is_mapped;

        const filteredChilds = menu.childs?.filter((child) => {
            return (
                child.is_mapped &&
                child.label.toLowerCase().includes(searchAssigned.toLowerCase())
            );
        }) || [];

        if (matchParent || filteredChilds.length > 0) {
            return {
                ...menu,
                childs: filteredChilds,
            };
        }

        return null;
    })
    .filter(Boolean);


    const unassignedMenuToRole = dataMenu
    ?.map((menu) => {
        const matchParent = menu.label.toLowerCase().includes(searchUnAssigned.toLowerCase()) && !menu.is_mapped;

        const filteredChilds = menu.childs?.filter((child) => {
            return (
                !child.is_mapped &&
                child.label.toLowerCase().includes(searchUnAssigned.toLowerCase())
            );
        }) || [];

        if (matchParent || filteredChilds.length > 0) {
            return {
                ...menu,
                childs: filteredChilds,
            };
        }

        return null;
    })
    .filter(Boolean);


    const saveMenu = () => {
        console.log(JSON.stringify(data))
        put(route('role.storemappingmenutorole', {role: role.id}), {
            onSuccess: () => {
                console.log("Success")
            },
            onError: (error) => {
                console.log("error", error)
            }
        })
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mapping Role/Peran ke Menu" />

            <PageLayout title="Mapping Role/Peran ke Menu" description="Kelola mapping role/peran ke menu">
                <div className='flex justify-between'>
                    <h3 className="my-2 text-2xl font-bold">Role/Peran : {role.name}</h3>
                    <Button variant="default" onClick={() => saveMenu()} ><Icons.SaveAllIcon /> {processing && <Icons.LoaderCircle className="h-4 w-4 animate-spin" />}Simpan</Button>
                </div>
                <Separator className='mb-4' />
                <div className="grid grid-cols-2 gap-2">
                    <div className="mr-2">
                        <h4 className="text-xl font-bold">Menu Tersedia</h4>
                        <Separator className="m-0" />
                        <Input className="my-4" placeholder="Cari Menu" onChange={(e) => setSearchUnassigned(e.target.value)} />
                        <div className="h-screen w-full overflow-auto rounded-lg border border-gray-50 p-2">
                            {unassignedMenuToRole
                                ?.filter((data) => data?.is_mapped == false)
                                .map((data) => {
                                    type IconKey = keyof typeof Icons;
                                    const IconComponent = Icons[data?.icon as IconKey] as LucideIcon;
                                    return (
                                        <div key={`unasign-${data?.id}`} className="p-1">
                                            <MenuItem
                                                iconNode={IconComponent}
                                                label={data?.label}
                                                info={data?.route_name}
                                                badgeLabel={data?.type}
                                                onClick={() => addToAssigned(data!)}
                                            />
                                            {data?.childs
                                                ?.filter((data) => data?.is_mapped == false)
                                                .map((child) => {
                                                    const IconChildComponent = Icons[child.icon as IconKey] as LucideIcon;
                                                    return (
                                                        <div key={`child-unasign-${child.id}`} className="my-2 ml-4">
                                                            <MenuItem
                                                                iconNode={IconChildComponent}
                                                                label={child.label}
                                                                info={child.route_name}
                                                                badgeLabel={child.type}
                                                                onClick={() => addToAssigned(child)}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="ml-2">
                        <h4 className="text-xl font-bold">Menu Termaping</h4>
                        <Separator />
                        <Input className="my-4" placeholder="Cari Menu" onChange={(e) => setSearchassigned(e.target.value)} />
                        <div className="h-screen w-full overflow-auto rounded-lg border border-gray-50 p-2">
                            {assignedMenutoRole?.map((data) => {
                                type IconKey = keyof typeof Icons;
                                const IconComponent = Icons[data?.icon as IconKey] as LucideIcon;
                                return (
                                    <div key={`mapped-${data?.id}`} className="p-1">
                                        <MenuItem
                                            iconNode={IconComponent}
                                            label={data?.label}
                                            isDelete={true}
                                            info={data?.route_name}
                                            badgeLabel={data?.type}
                                            onClick={() => unAssign(data!)}
                                        />
                                        {data?.childs
                                            ?.filter((data) => data?.is_mapped == true)
                                            .map((child) => {
                                                const IconChildComponent = Icons[child.icon as IconKey] as LucideIcon;
                                                return (
                                                    <div key={`child-mapped-${child.id}`} className="my-2 ml-4">
                                                        <MenuItem
                                                            iconNode={IconChildComponent}
                                                            label={child.label}
                                                            info={child.route_name}
                                                            badgeLabel={child.type}
                                                            isDelete={true}
                                                            onClick={() => unAssign(child)}
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </PageLayout>
        </AppLayout>
    );
}
