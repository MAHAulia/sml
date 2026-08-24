export interface ManifestSerahData {
    id: number;
    code: string;
    user_id: number;
    from: string;
    to: string;
    office_from: string;
    office_to: string;
    type: string;
    status: string;
    items: ManifestSerahDetail[];
}

export interface ManifestSerahDetail {
    id: number;
    manifest_id: number;
    item_id: number;
}

export interface Kantor {
    id: number;
    code: string;
    name: string;
    address?: string;
    phone?: string;
}

export interface Mobil {
    id: number;
    nopol: string;
    merek: string;
    description: string;
}
export interface BagianTujuan {
    id: number;
    name: string;
}
