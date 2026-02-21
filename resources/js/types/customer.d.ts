export interface CustomerData {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface Person {
    id: number | null;
    name: string;
    address: string;
    phone: string;
}

export interface ItemDimension {
    p: number;
    l: number;
    t: number;
}

export interface SelectedOffer {
    id: number;
    sender: Person;
    receiver: Person;
    dimention: ItemDimension;
    berat: number;
    isiKiriman: string;
    catatan: string;
}