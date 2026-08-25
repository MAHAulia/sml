export interface SuratJalanData {
    id: number;
    code: string;
    status: string;
    user_id: number;
    mobil_id: number;
    nopol: string;
    driver_id: number;
    to: string;
    items: SuratJalanDetail[];
}

export interface SuratJalanDetail {
    id: number;
    surat_jalan_id: number;
    manifest_id: number;
}
