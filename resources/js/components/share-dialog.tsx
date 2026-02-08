import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FormulirData } from "@/types";
import { Check, CopyIcon, LinkIcon, QrCodeIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function ShareDialog({ open, onOpenChange, formulir }: { open: boolean, onOpenChange: (open: boolean) => void, formulir: FormulirData }) {
    const [successCopyLink, setSuccessCopyLink] = useState(false);
    const [successCopyQr, setSuccessCopyQr] = useState(false);

    // Fungsi untuk mengubah SVG menjadi PNG dengan border dan teks, lalu menyalinnya ke clipboard
    const copySvgAsPngToClipboard = async (svgElementId: string, qrUrl: string) => { // qrUrl adalah string URL QR code
        try {
            const svgElement = document.getElementById(svgElementId);
            if (!svgElement) {
                console.error("Elemen SVG tidak ditemukan.");
                return;
            }

            const canvas = document.createElement('canvas');
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const img = new Image();

            // Pengaturan untuk teks
            const headerText = "Pindai untuk mengakses formulir";
            const fontSizeHeader = 14; // Ukuran font untuk header
            const fontSizeUrl = 10;    // Ukuran font untuk URL (lebih kecil)
            const fontStyleHeader = `${fontSizeHeader}px Arial`;
            const fontStyleUrl = `${fontSizeUrl}px Arial`;
            const textPadding = 10;    // Padding di atas dan di bawah area teks
            const lineSpacing = 5;     // Jarak antar baris teks

            // Atur ukuran kanvas sesuai ukuran SVG
            const svgRect = svgElement.getBoundingClientRect();
            const borderWidth = 10; // Lebar border

            // Hitung lebar maksimum untuk teks
            const maxTextWidth = svgRect.width + (2 * borderWidth) - (2 * textPadding);

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            let totalTextHeight = 0;
            const urlLines: string[] = [];

            if (tempCtx) {
                // Ukur tinggi header
                tempCtx.font = fontStyleHeader;
                totalTextHeight += fontSizeHeader + lineSpacing; // Tinggi header + spasi di bawahnya

                // Ukur tinggi URL (dengan pembungkus kata)
                tempCtx.font = fontStyleUrl;
                const words = qrUrl.split(' ');
                let currentLine = '';

                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    const testLine = currentLine === '' ? word : currentLine + ' ' + word;
                    const metrics = tempCtx.measureText(testLine);
                    if (metrics.width > maxTextWidth && currentLine !== '') {
                        urlLines.push(currentLine);
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                urlLines.push(currentLine); // Tambahkan baris terakhir

                totalTextHeight += urlLines.length * fontSizeUrl + (urlLines.length > 1 ? (urlLines.length - 1) * lineSpacing : 0);
            }

            totalTextHeight += (2 * textPadding); // Tambah padding atas dan bawah untuk keseluruhan area teks

            canvas.width = svgRect.width + (2 * borderWidth);
            // Tinggi kanvas = Tinggi QR + Tinggi Border + Tinggi Area Teks
            canvas.height = svgRect.height + (2 * borderWidth) + totalTextHeight;


            // Pastikan gambar dimuat sebelum digambar ke kanvas
            img.onload = async () => {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Isi latar belakang dengan warna putih
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Gambar SVG QR Code ke kanvas, dengan offset untuk border
                    ctx.drawImage(img, borderWidth, borderWidth);

                    // Tambahkan border di sekitar QR Code
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 5;
                    ctx.strokeRect(
                        borderWidth / 2,
                        borderWidth / 2,
                        svgRect.width + borderWidth,
                        svgRect.height + borderWidth
                    );

                    // --- Tambahkan Teks di bawah QR Code ---
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center'; // Rata tengah teks

                    let currentY = svgRect.height + (2 * borderWidth) + textPadding; // Posisi Y awal untuk area teks

                    // Gambar teks header
                    ctx.font = fontStyleHeader;
                    ctx.fillText(headerText, canvas.width / 2, currentY + fontSizeHeader);
                    currentY += fontSizeHeader + lineSpacing;

                    // Gambar teks URL
                    ctx.font = fontStyleUrl;
                    urlLines.forEach((line) => {
                        ctx.fillText(line, canvas.width / 2, currentY + fontSizeUrl);
                        currentY += fontSizeUrl + lineSpacing;
                    });


                    // Dapatkan data URL PNG dari kanvas
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            try {
                                await navigator.clipboard.write([
                                    new ClipboardItem({
                                        'image/png': blob
                                    })
                                ]);
                                setSuccessCopyQr(true);
                                setTimeout(() => setSuccessCopyQr(false), 2000);
                            } catch (err) {
                                console.error('Gagal menyalin gambar ke clipboard:', err);
                                alert('Gagal menyalin gambar QR. Pastikan browser Anda mendukung Clipboard API untuk gambar.');
                            }
                        } else {
                            console.error('Gagal membuat Blob dari kanvas.');
                        }
                    }, 'image/png');
                }
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

        } catch (err) {
            console.error('Kesalahan saat menyalin QR:', err);
            alert('Terjadi kesalahan saat menyalin QR.');
        }
    };

    const qrCodeString = route('formulir.view', formulir?.slug ?? '-');

    return (
        <Dialog open={open} onOpenChange={(value) => {
            onOpenChange(value);
            if (value === false) {
                setSuccessCopyLink(false);
                setSuccessCopyQr(false);
            }
        }}>
            <DialogContent className="sm:max-w-[620px]">
                <DialogHeader>
                    <DialogTitle>Bagikan Formulir</DialogTitle>
                    <DialogDescription>
                        Bagikan formulirmu sekarang juga
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-2">
                    <div className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" /><Label>Tautan</Label>
                    </div>
                    <div className="flex">
                        <Input value={qrCodeString} readOnly />
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(qrCodeString)
                                    .then(() => {
                                        setSuccessCopyLink(true);
                                        setTimeout(() => setSuccessCopyLink(false), 2000);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        setSuccessCopyLink(false);
                                    });
                            }}
                            className="mx-2"
                        >
                            {successCopyLink ? <Check className="animate-bounce" /> : <CopyIcon />}Salin
                        </Button>
                        <Button
                            onClick={() => {
                                const url = qrCodeString;
                                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, '_blank');
                            }}
                            className="mx-1"
                        >
                            <SendIcon />Kirim
                        </Button>
                    </div>
                    <small className="ml-1 -mt-1 text-gray-500 text-xs">Bagikan tautan untuk memulai mengisi formulir </small>
                    <Separator className="my-4" />
                    <div className="flex items-center">
                        <QrCodeIcon className="w-4 h-4 mr-2" /><Label>Kode QR</Label>
                    </div>
                    <div className="flex flex-col w-full justify-center items-center">
                        <QRCode
                            size={256}
                            value={qrCodeString}
                            viewBox={`0 0 256 256`}
                            id="qr-code"
                        />
                    </div>
                    <small className="ml-1 -mt-1 text-gray-500 text-xs mx-4 text-center">Scan untuk memulai mengisi formulir </small>
                    <Button onClick={() => copySvgAsPngToClipboard('qr-code', qrCodeString)} className="mx-auto">
                        {successCopyQr ? <Check className="animate-bounce " /> : <CopyIcon />}Salin
                    </Button>
                    <Separator />
                </div>
            </DialogContent>
        </Dialog>
    );
}