export interface Offerings {
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