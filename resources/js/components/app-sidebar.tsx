import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MenuData, SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Langganan',
    //     name: "documentation",
    //     // href: route('langganan.index'),
    //     href: "",
    //     icon: Icons.ShieldCheck,
    //     isChild: false,
    //     children: [],
    // },
    // {
    //     title: 'Support',
    //     // href: route('support.index'),
    //     href: "",
    //     icon: Icons.MessageCircleQuestion,
    //     name: '',
    //     isChild: false,
    //     children: []
    // },

];

function getIcon(name: string): LucideIcon {
    return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.LayoutGrid;
}

function mapMenusToNavItems(menus: MenuData[]): NavItem[] {
    return menus
        .filter(menu => menu.type === "menu" )
        .map(menu => ({
            title: menu.label,
            href: route().has(menu.route_name) ? route(menu.route_name) : '#',
            name: menu.route_name,
            isChild: menu.is_parent,
            icon: getIcon(menu.icon),
            children: (menu.childs?.filter(child => child.type === "menu") || []).map(child => ({
                title: child.label,
                href: route().has(child.route_name) ? route(child.route_name) : '#',
                name: child.route_name,
                isChild: !child.is_parent, // FIXED: use child’s is_parent
                icon: getIcon(child.icon),
                children: [], // If you support deeper levels, recurse here
            })),
        }));
}


export function AppSidebar() {
    const page = usePage<SharedData>();
    const { menus } = page.props;
    const navItems = mapMenusToNavItems(menus);
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
