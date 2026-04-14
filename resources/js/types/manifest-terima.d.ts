export interface ManifestTerimaData {
    id: number;
    code: string;
    user_id: number;
    from: string;
    to: string;
    office_from: string;
    office_to: string;
    type: string;
    status: string;
    items: ManifestTerimaDetail[];
}

export interface ManifestTerimaDetail {
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

export interface BagianTujuan {
    id: number;
    name: string;
}
