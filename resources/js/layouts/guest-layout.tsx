import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
// import { cn } from '@/lib/utils'; // Pastikan path ini benar
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';

export default function GuestLayout({ children, title }: { children: React.ReactNode, title: string }) {
    const { auth } = usePage<SharedData>().props;
    const [priceUrl, setPriceUrl] = useState("#harga")
    useEffect(() => {
        if (route().current() === 'termsAndConditions' || route().current() === 'privacyPolicy') {
            setPriceUrl(`${route('home')}/#harga`)
        }
    },[])
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-background font-sans antialiased text-foreground">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto flex h-14 items-center justify-center px-4 md:px-6">
                        <Link href="/" className="mr-6 flex items-center">
                            <div className="font-bold text-xl">Easy</div><div className="font-extrabold text-xl text-primary">Form</div>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                            <a href={route('formulir.view', 'TiNzA4')} target='_blank' className="transition-colors hover:text-primary">
                                Coba
                            </a>
                            <Link href={priceUrl} className="transition-colors hover:text-primary">
                                Harga
                            </Link>
                            {/* <Link href="#" className="transition-colors hover:text-primary">
                                Alat
                            </Link> */}
                        </nav>
                        <div className="flex flex-1 items-center justify-end space-x-4">
                            {auth.user ? (<Link href="/login">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>) : (<><Link href="/login">
                                <Button variant="ghost">Masuk</Button>
                            </Link>
                                <Link href="/register">
                                    <Button>Mulai secara gratis</Button>
                                </Link></>)}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main>{children}</main>

                {/* Footer */}
                <footer className="border-t bg-background py-12">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex flex-col items-center gap-2 px-8 md:items-start md:px-0">
                            <Link href="/" className="flex items-center">
                                <div className="font-bold text-xl">Easy</div><div className="font-extrabold text-xl text-primary">Form</div>
                            </Link>
                            <p className="text-center text-sm text-muted-foreground md:text-left">
                                Buat <span className='text-primary font-semibold'>formulir</span> online dan terima respons langsung di nomor <span className='text-primary font-semibold'>WhatsApp</span> Anda. Mudah, cepat, dan efisien.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 md:justify-end">
                            {/* <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                Pusat Bantuan
                            </Link>
                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                                System Status
                            </Link> */}
                            <Link href={route('privacyPolicy')} className="text-sm text-muted-foreground hover:text-primary">
                                Kebijakan Privasi
                            </Link>
                            <Link href={route('termsAndConditions')} className="text-sm text-muted-foreground hover:text-primary">
                                Syarat dan Ketentuan
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}