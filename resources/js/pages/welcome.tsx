import PricingCard from '@/components/pricing-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import GuestLayout from '@/layouts/guest-layout';
import { Pricing } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

// Anda juga perlu menginstal komponen ikon seperti lucide-react
// npm install lucide-react

export default function Welcome() {
    const [isYearly, setIsYearly] = useState(false);
    const {get} = useForm()

    const pricingPlans: Pricing[] = [
        {
            plan: 'Gratis',
            price: 0,
            description: 'Memulai dengan fitur dasar.',
            features: [
                { text: '2 Form', available: true },
                { text: '50 Pengisian/bulan', available: true },
                { text: 'Response melalui WhatsApp', available: true },
                { text: 'AI', available: true },
                { text: 'Dashboard responses', available: true },
                // { text: 'Template', available: false },
                // { text: 'Domain Kustom', available: false },
                // { text: 'Upload File', available: false },
                // { text: 'Priority Support', available: false },
            ],
            ctaText: 'Mulai secara gratis',
            ctaVariant: 'default',
            isHighlighted: true,
        },
        // {
        //     plan: 'Basic',
        //     price: isYearly ? 10000 * 12 * 0.8 : 10000, // 20% diskon
        //     description: 'Cocok untuk usaha kecil.',
        //     features: [
        //         { text: '10 Form', available: true },
        //         { text: '250 Pengisian/bulan', available: true },
        //         { text: 'Response melalui WhatsApp', available: true },
        //         { text: 'Dashboard responses', available: true },
        //         { text: 'Templates', available: true },
        //         // { text: 'Domain Kustom', available: false },
        //         // { text: 'File Uploads', available: false },
        //         { text: 'Priority Support', available: false },
        //     ],
        //     // ctaText: 'Upgrade ke Pro',
        //     ctaText: 'Akan segera hadir',
        //     ctaVariant: 'outline',
        //     isHighlighted: false,
        // },
        // {
        //     plan: 'Bisnis',
        //     price: isYearly ? 30000 * 12 * 0.8 : 30000, // 20% diskon
        //     description: 'Cocok untuk perusahaan yang lebih besar.',
        //     features: [
        //         { text: 'Form Takterbatas', available: true },
        //         { text: 'Pengisian Takterbatas', available: true },
        //         { text: 'Response melalui WhatsApp', available: true },
        //         { text: 'Dashboard responses', available: true },
        //         { text: 'Templates', available: true },
        //         // { text: 'Domain Kustom', available: true },
        //         // { text: 'File Uploads', available: true },
        //         { text: 'Priority Support', available: true },
        //     ],
        //     // ctaText: 'Upgrade ke Business',
        //     ctaText: 'Akan segera hadir',
        //     ctaVariant: 'outline',
        //     isHighlighted: false,
        // },
    ];

    const handleOnClickPrice = (plan: Pricing) => {
        if (plan.plan === 'Gratis') {
            get(route('register'))
            return
        }
    }

    return (
        <GuestLayout title="EasyForm">
            {/* Hero Section */}
            <section className="container mx-auto flex flex-col items-center justify-center py-20 md:py-32">
                <div className="max-w-4xl text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Terima Pesanan, Pendaftaran, Survei melalui <span className='text-primary font-semibold'>WhatsApp</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10">
                        Buat form online dan terima respons langsung di nomor <span className='text-primary font-semibold'>WhatsApp</span> mu. Mudah, cepat, dan efisien.
                    </p>
                    <Button size="lg" className="text-lg px-8 py-6" onClick={() => get(route('register'))}>
                        Mulai secara gratis
                    </Button>
                </div>
                {/* Anda bisa menambahkan ilustrasi atau gambar mockup di sini */}
                <div className="mt-16">
                    <img src="form-builder.png" alt="EasyFormMockup" className="rounded-lg shadow-2xl max-w-full h-auto" />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="container mx-auto py-20">
                <h2 className="text-4xl font-bold text-center mb-16">Bagaimana Cara Kerjanya?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-2xl mb-4">
                            1
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Buat Form Anda</h3>
                        <p className="text-muted-foreground">
                            Gunakan builder form drag & drop kami yang sederhana untuk membuat form kustom Anda.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-2xl mb-4">
                            2
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Bagikan Link Form</h3>
                        <p className="text-muted-foreground">
                            Bagikan tautan form Anda kepada pelanggan melalui <span className='text-primary font-semibold'>WhatsApp</span>, media sosial, atau website Anda.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-2xl mb-4">
                            3
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Terima Respons di <span className='text-primary font-semibold'>WhatsApp</span></h3>
                        <p className="text-muted-foreground">
                            Setiap kali ada yang mengisi form, Anda akan langsung menerima respons di <span className='text-primary font-semibold'>WhatsApp</span> Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section className="container mx-auto py-20">
                <h2 className="text-4xl font-bold text-center mb-16">Pilih dari Template Siap Pakai</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <img src="order-online.png" alt="Pesanan Online Template" className="rounded-md" />
                            {/* <a href="https://www.freepik.com/free-photo/beautiful-smart-asian-young-entrepreneur-business-woman-owner-sme-checking-product-stock-scan-qr-code-working-home_4395082.htm#fromView=search&page=1&position=3&uuid=455296d3-9c7b-4ff9-b49b-9a434c2fcdf4&query=order+online" className='text-xs text-right'>Image by tirachardz on Freepik</a> */}
                            <CardTitle className='mt-4'>Pesanan Online</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Terhubung langsung dengan pelanggan online Anda, dan terima pesanan secara langsung.
                            </p>
                            <Button variant="outline" className="w-full">
                                Buat <span className='text-primary font-semibold'>Formulir</span> Pesanan Online
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <img src="event-registration.png" alt="Pendaftaran Event Template" className="rounded-md" />
                            {/* <a href="https://www.freepik.com/free-photo/crop-student-writing-notepad_1313979.htm#fromView=search&page=1&position=9&uuid=67be7025-b753-45fe-bcbc-2f22d038faf1&query=event+registration" className='text-xs text-right'>Image by freepik</a> */}
                            <CardTitle className='mt-4'>Pendaftaran Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Buat <span className='text-primary font-semibold'>Formulir</span> pendaftaran event yang akan akan berlangsung dan diisi oleh calon peserta secara langsung.
                            </p>
                            <Button variant="outline" className="w-full">
                                Buat <span className='text-primary font-semibold'>Formulir</span> Pendaftaran Event
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <img src="kritik-saran.png" alt="Kritik dan Saran Template" className="rounded-md" />
                            {/* <a href="https://www.freepik.com/free-photo/smiley-woman-holding-post-its_23994274.htm#fromView=search&page=1&position=34&uuid=f54f386b-a556-4642-ad2f-c93a360f396a&query=Criticism+and+suggestions" className='text-xs text-right'>Image by freepik</a> */}
                            <CardTitle className='mt-4'>Kritik dan Saran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Terima kritik dan saran dari pelanggan Anda secara langsung
                            </p>
                            <Button variant="outline" className="w-full">
                                Buat <span className='text-primary font-semibold'>Formulir</span> Kritik dan Saran
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="harga" className="container mx-auto py-20 bg-background">
                <div className="text-center mb-16">
                    {/* <h2 className="text-4xl font-bold mb-4">Pilih Paket yang Sempurna untuk Anda</h2> */}
                    <h2 className="text-4xl font-bold mb-4">Mulai Secara Gratis</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Mulai dari paket <span className='text-primary font-semibold'>GRATIS</span> selamanya. Tingkatkan paket Anda seiring pertumbuhan bisnis Anda.
                    </p>
                </div>

                {/* Toggle Bulanan/Tahunan */}
                {/* <div className="flex items-center justify-center space-x-2 mb-12">
                    <Label htmlFor="billing-toggle" className="text-lg font-semibold">
                        Bulanan
                    </Label>
                    <Switch
                        id="billing-toggle"
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                        className="data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="billing-toggle" className="text-lg font-semibold">
                        Tahunan (Hemat 20%)
                    </Label>
                </div> */}

                {/* Grid Paket Harga */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"> */}
                <div className="grid grid-cols-1 md:grid-cols-1 colsp gap-8 max-w-xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard 
                            key={index} 
                            plan={plan.plan} 
                            price={plan.price} 
                            description={plan.description} 
                            features={plan.features} 
                            ctaText={plan.ctaText} 
                            ctaVariant={plan.ctaVariant} 
                            isHighlighted={plan.isHighlighted} 
                            isYearly={isYearly} 
                            onclick={() => handleOnClickPrice(plan)}
                        />
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            {/* <section className="container mx-auto py-20">
                <h2 className="text-4xl font-bold text-center mb-16">Pertanyaan yang Sering Diajukan</h2>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Apakah EasyForm ini gratis?</AccordionTrigger>
                            <AccordionContent>
                                Ya, kami memiliki paket gratis selamanya. Anda bisa memilih paket berbayar jika membutuhkan fitur yang lebih canggih.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Apakah data saya aman?</AccordionTrigger>
                            <AccordionContent>
                                Server kami sangat aman. Kami menggunakan Amazon Web Services dan Cloudflare CDN.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Bagaimana cara memulai?</AccordionTrigger>
                            <AccordionContent>
                                Cukup mendaftar menggunakan akun Google dan buat form Anda dari template yang tersedia.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section> */}
        </GuestLayout>
    );
}