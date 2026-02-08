import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";

interface QrisCardProps {
    qrString: string;
    merchantName: string;
    nmid: string;
    transactionId?: string;
}

export default function QrisCard({ qrString, merchantName, nmid, transactionId }: QrisCardProps) {
    return (
        <Card className="relative w-full gap-0 max-w-sm border shadow-lg bg-white pt-0 pb-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8">
                <div className="flex items-center">
                    <img src="/qris.png" alt="QRIS" className="h-24" />
                    <div className="font-bold text-sm">
                        <p>QR Code Standar</p>
                        <p>Pembayaran Nasional</p>
                    </div>
                </div>
                <img src="/gpn.png" alt="GPN" className="h-10" />
            </div>

            {/* Merchant Info */}
            <div className="text-center">
                <h2 className="text-3xl font-bold uppercase">{merchantName}</h2>
                <p className="text-xs text-gray-600">NMID: {nmid}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-3 z-50">
                <div className="bg-white p-2 border">
                    <QRCode
                        value={qrString}
                        viewBox="0 0 256 256"
                        id={transactionId}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        className="p-1"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="text-left px-12">
                <p className="text-xs">Dicetak oleh: (93600181)</p>
            </div>

            {/* Red Triangle Decoration */}
            <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[120px] border-t-[120px] border-r-red-600 border-t-transparent" />

            {/* Red Triangle Decoration Left Center */}
            <div className="absolute top-2/5 left-0 -translate-y-1/2 w-0 h-0  border-t-[80px] border-b-[80px] border-l-[80px] border-t-transparent border-b-transparent border-l-red-600" />
        </Card>
    );
}
