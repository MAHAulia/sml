import { CustomerData } from "./customer";

export interface Offerings {
    id: number;
    user_id: number;
    customer_id: number;
    biaya_id: number | null;
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    total_item: number;
    p: number;
    l: number;
    t: number;
    weight: number;
    isiKiriman: string;
    catatan: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    biaya: Biayas;
    customer: CustomerData;
}

export interface Biayas {
    id: number;
    base_price: number;
    offring_price: number;
    deal_price: number | null;
    nego_price: number | null
    status: 'pending' | 'on_nego' | 'accepted' | 'rejected';
    created_at: string;
    updated_at: string;
}

 