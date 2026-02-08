import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

// type User = {
//     id: number;
//     name: string;
// }
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    name: string;
    isChild: boolean;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    menus: Menu[];
    can: Record<string, boolean>;
    flash: FlashProps;
    qr: QrPayment;
    [key: string]: unknown;
}

export interface UserData {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role_id?: number;
    role?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface MenuData {
    id: number;
    label: string;
    icon: string;
    route_name: string;
    is_parent: boolean;
    parent_id: number;
    order_number: number;
    type: 'menu' | 'form' | 'api' | 'default';
    is_mapped: boolean;
    parent?: MenuData;
    childs?: MenuData[];
}

export interface RoleData {
    id: number;
    name: string;
    description: string?;
}

export interface FormData {
    id: number;
    name: string;
    description: string?;
}

interface FlashProps {
    type?: 'info' | 'error' | 'warning' | '';
    title?: string;
    message?: string;
    whatsappUrl: string;
}

// --- Type Definitions (Ensure these are at the top of your Form.tsx file) ---
type Option = {
    id: string; // Unique ID for DND
    value: string; // The actual value of the option
    text: string; // The display text of the option
    image?: File; // Optional image for the option
};

type Question = {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    placeholder?: string;
    required: boolean;
    paragraph?: boolean;
    image?: File;
    options?: Option[];
    addOtherOption?: boolean;

    // Properties for 'Number' type
    inputType?: 'integer' | 'decimal';
    minValue?: number;
    maxValue?: number;
    prefix?: string;
    suffix?: string;

    // New property for 'Rating' type
    ratingStyle?: 'star' | 'survey'; // 'star' or 'survey'

    // New properties for 'Date' type
    datePickerType?: 'date' | 'date-time'; // 'date' or 'date-time'
    timeFormat?: 'AM/PM' | '24-hour'; // 'AM/PM' or '24-hour'
    disablePastDates?: boolean; //
    disableFutureDates?: boolean; //

    // New properties for 'Image' type
    imageTitle?: string; // Title for the image question
    imageCaption?: string; // Caption for the image
    imageUrl?: string; // URL for linked images

    // New properties for 'Video' type
    videoUrl?: string;
    videoTitle?: string;
    videoCaption?: string;
    inputValue?: string | string[];
};

type FormulirData = {
    id: number;
    title: string;
    form: Question[];
    slug: string;
    isPinned: boolean;
    totalResponses?: number;
    created_at: string;
};

type FormulirDataDetail = {
    id: number;
    formulir_id: string;
    formulir_data: Question[];
    submitted_via: string;
    ip_address: boolean;
    user_agent: number;
    submitted_at: string;
    created_at: string;
    updated_at: string;
};

type AnswerValue = string | string[] | number | null;
type FormAnswers = Record<string, AnswerValue>;

type Feature = {
    text: string;
    available: boolean;
};

type Pricing = {
    plan: string;
    price: number;
    description: string;
    features: Feature[];
    ctaText: string;
    ctaVariant: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    isHighlighted: boolean;
};

type UserPlan = {
    form: number;
    limit: number;
    response_wa: boolean;
    ai: boolean;
    dashboard_response: boolean;
};

type PlanBiaya = {
    C_AI: BiayaDetail;
    C_DR: BiayaDetail;
    C_Form: BiayaDetail;
    C_FRL: BiayaDetail;
};

type BiayaDetail = {
    amount: number;
    isDiscount: number;
    satuan: number;
};

type QrPayment = {
    message: string;
    data: {
        payload: {
            terminal: string;
            type: string;
            inquiry: string;
            amount: number;
            transaction_id: string;
        };
        qr_string: string;
        qr_specification: {
            correction_level: string;
            size: string;
        };
    };
    nmid: string;
};

type Support = {
    id: number;
    title: string;
    type: 'email' | 'whatsapp';
    description: string;
    value: string;
};

type ShareDialogState = {
    open: boolean;
    formulir?: FormulirData;
};


type TopUpData = {
    amount: string;
    description: string;
    transaction_id: string;
    status: string;
    expired_at: string;
    payment_info: QrPayment;
}
