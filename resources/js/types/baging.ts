export interface BagingData {
    id: number;
    code: string;
    user_id: number;
    office: string;
    office_to: string;
    status: string;
    items: BagingDetail[];
}

export interface BagingDetail {
    id: number;
    bag_id: number;
    transactionId: number;
}