export interface DeliveryOrderData {
    id: number;
    code: string;
    user_id: number;
    status: string;
    items: DeliveryOrderDetail[];
}

export interface DeliveryOrderDetail {
    id: number;
    delivery_order_id: number;
    transaction_id: number;
}
