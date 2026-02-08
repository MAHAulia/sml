import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Buat Formulir',
        href: '/form',
        icon: null,
        name: '',
        isChild: false,
        children: []
    },
    {
        title: 'Bagikan',
        href: '/form/builder/share',
        icon: null,
        name: '',
        isChild: false,
        children: []
    },
    {
        title: 'Response',
        href: '/form/builder/responses',
        icon: null,
        name: '',
        isChild: false,
        children: []
    },
];

export default function FormLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4">
            {/* <Heading title="Formulir" description="Buat formulir Anda" /> */}

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-full">
                    <section className="max-w-full max-h-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
