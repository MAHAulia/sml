import AppLogoIcon from "@/components/app-logo-icon";
import { InvoiceData } from "@/types/invoice";
import { Signature } from "lucide-react";

const PPN_RATE = 0.11;

const formatRupiah = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value));
};

const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case "paid":
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";

        case "pending":
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";

        case "cancelled":
            return "bg-red-50 text-red-700 ring-1 ring-red-600/20";

        default:
            return "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
    }
};

interface InvoiceProps {
    invoice: InvoiceData;
}

export default function Verify({ invoice }: InvoiceProps) {
    /**
     * ============================
     * Invoice Calculation
     * ============================
     *
     * Subtotal : Rp35.000
     * PPN 11%  : Rp3.850
     * Total    : Rp38.850
     */

    const subtotal = Number(invoice.nominal);

    const ppn = Math.round(subtotal * PPN_RATE);

    const grandTotal = subtotal + ppn;

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Action */}
                <div className="mb-5 flex justify-end gap-3 print:hidden">
                    <div className="mb-5 flex justify-end gap-3 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            <Signature/>
                            Verifikasi & Kirim
                        </button>
                    </div>
                    <div className="mb-5 flex justify-end gap-3 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 17h2a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2zm6-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v4h8z"
                                />
                            </svg>

                            Print Invoice
                        </button>
                    </div>
                </div>

                {/* Invoice */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60">

                    {/* Header */}
                    <div className="border-b border-slate-200 px-6 py-8 sm:px-10">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <AppLogoIcon className="h-26 w-26" />

                                    <div>
                                        <h1 className="text-xl font-bold text-slate-900">
                                            INVOICE
                                        </h1>

                                        <p className="text-sm text-slate-500">
                                            Payment Invoice
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-sm font-medium text-slate-500">
                                    Invoice Number
                                </p>

                                <p className="mt-1 text-lg font-bold tracking-wide text-slate-900">
                                    {invoice.no_invoice}
                                </p>

                                <span
                                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                        invoice.status
                                    )}`}
                                >
                                    {invoice.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Information */}
                    <div className="grid grid-cols-1 gap-8 border-b border-slate-200 px-6 py-8 sm:grid-cols-2 sm:px-10">

                        {/* From */}
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                To
                            </p>

                            <h2 className="text-base font-bold text-slate-900">
                                {invoice.mitra.name}
                            </h2>

                            <div className="mt-3 space-y-1 text-sm text-slate-500">
                                <p>{invoice.mitra.email}</p>

                                <p>{invoice.mitra.phone}</p>

                                <p className="whitespace-pre-line pt-2">
                                    {invoice.mitra.address}
                                </p>
                            </div>
                        </div>

                        {/* Invoice Information */}
                        <div className="sm:text-right">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Invoice Information
                            </p>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between gap-6 sm:justify-end">
                                    <span className="text-slate-500">
                                        Invoice ID
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        #{invoice.id}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-6 sm:justify-end">
                                    <span className="text-slate-500">
                                        Issue Date
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        {formatDate(invoice.updated_at)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-6 sm:justify-end">
                                    <span className="text-slate-500">
                                        Payment Date
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        {formatDate(invoice.paid_at)}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-6 sm:justify-end">
                                    <span className="text-slate-500">
                                        Aging
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        {invoice.aging} day
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-8 sm:px-10">

                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <table className="w-full">

                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Description
                                        </th>

                                        <th className="hidden px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                                            Qty
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">

                                    {invoice.details.map((item, index) => (
                                        <tr key={item.id}>

                                            <td className="px-5 py-5">
                                                <p className="font-medium text-slate-900">
                                                    Transaction #{item.transaction_id}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Invoice item #{index + 1}
                                                </p>
                                            </td>

                                            <td className="hidden px-5 py-5 text-center text-sm text-slate-600 sm:table-cell">
                                                1
                                            </td>

                                            <td className="px-5 py-5 text-right text-sm font-medium text-slate-900">
                                                {formatRupiah(subtotal)}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                        {/* ============================
                            Invoice Summary
                        ============================ */}

                        <div className="mt-6 flex justify-end">

                            <div className="w-full sm:w-96">

                                {/* Subtotal */}
                                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                                    <span className="text-slate-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        {formatRupiah(subtotal)}
                                    </span>
                                </div>

                                {/* PPN */}
                                <div className="flex items-center justify-between border-b border-slate-200 py-3 text-sm">
                                    <div>
                                        <span className="text-slate-500">
                                            PPN
                                        </span>

                                        <span className="ml-1 text-xs text-slate-400">
                                            (11%)
                                        </span>
                                    </div>

                                    <span className="font-medium text-slate-900">
                                        {formatRupiah(ppn)}
                                    </span>
                                </div>

                                {/* Grand Total */}
                                <div className="mt-4 rounded-xl bg-indigo-50 px-5 py-4">
                                    <div className="flex items-center justify-between">

                                        <div>
                                            <p className="text-sm font-medium text-slate-600">
                                                Grand Total
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Including PPN 11%
                                            </p>
                                        </div>

                                        <span className="text-2xl font-bold text-indigo-600">
                                            {formatRupiah(grandTotal)}
                                        </span>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div
                        className={`mx-6 mb-8 rounded-xl p-5 sm:mx-10 ${invoice.status === "paid"
                                ? "bg-emerald-50"
                                : invoice.status === "pending"
                                    ? "bg-red-50"
                                    : "bg-amber-50"
                            }`}
                    >
                        <div className="flex gap-4">

                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${invoice.status === "paid"
                                        ? "bg-emerald-100 text-emerald-600"
                                        : invoice.status === "pending"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-amber-100 text-amber-600"
                                    }`}
                            >
                                {invoice.status === "paid" ? (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                            </div>

                            <div>

                                <h3
                                    className={`font-semibold ${invoice.status === "paid"
                                            ? "text-emerald-900"
                                            : invoice.status === "unpaid"
                                                ? "text-red-900"
                                                : "text-amber-900"
                                        }`}
                                >
                                    {invoice.status === "paid"
                                        ? "Payment Completed"
                                        : invoice.status === "unpaid"
                                            ? "Payment Unpaid"
                                            : "Payment Pending"}
                                </h3>

                                <p
                                    className={`mt-1 text-sm ${invoice.status === "paid"
                                            ? "text-emerald-700"
                                            : invoice.status === "unpaid"
                                                ? "text-red-700"
                                                : "text-amber-700"
                                        }`}
                                >
                                    {invoice.status === "paid"
                                        ? "Invoice ini telah dibayar."
                                        : invoice.status === "unpaid"
                                            ? "Invoice ini belum dibayar."
                                            : "Invoice ini belum dibayar. Silakan lakukan pembayaran sebelum jatuh tempo."}
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-10">

                        <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="font-medium text-slate-700">
                                    Thank you for your business.
                                </p>

                                <p className="mt-1">
                                    Invoice generated electronically.
                                </p>
                            </div>

                            <div className="sm:text-right">
                                <p className="font-medium text-slate-700">
                                    {invoice.mitra.email}
                                </p>

                                <p className="mt-1">
                                    {invoice.mitra.phone}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Print CSS */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    body {
                        background: white !important;
                    }

                    .print\\:hidden {
                        display: none !important;
                    }

                    .shadow-xl {
                        box-shadow: none !important;
                    }

                    .rounded-2xl {
                        border-radius: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
