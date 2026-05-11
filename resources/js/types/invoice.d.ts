import { CustomerData } from './customer';
import { TransactionsData } from './marketing';

export interface InvoiceData {
    id: number;
    user_id: number;
    customer_id: number;
    no_invoice: string;
    status: 'paid' | 'unpaid' | 'pending';
    reason: string | null;
    nominal: number;
    paid_at: string;
    details: InvoiceDetailData[];
    mitra: CustomerData;
    created_at: string;
}

export interface InvoiceDetailData {
    id: number;
    user_id: number;
    customer_id: number;
    invoice_id: number;
    transaction_id: number;
    items: TransactionsData[];
}
