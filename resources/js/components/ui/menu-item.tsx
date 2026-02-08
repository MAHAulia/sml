import { ArrowRight, LucideIcon, Trash2Icon } from 'lucide-react';
import { Badge } from './badge';

interface MenuItemProps {
    iconNode?: LucideIcon | null;
    className?: string;
    label?: string;
    info?: string;
    badgeLabel?: string;
    isDelete?: boolean;
    onClick?: () => void
}

export function MenuItem({ iconNode: IconComponent, className, label, onClick, info, badgeLabel, isDelete = false }: MenuItemProps) {
    if (!IconComponent) {
        return null;
    }

    return <div className='flex justify-between border border-gray-300 p-2 rounded-lg items-center cursor-pointer' onClick={onClick}>
        <div className='flex'>
            <IconComponent className={className} /> <span className='ml-4'>{label}</span>
        </div>
        <div className='flex items-center'>
            <span className='mx-2 text-sm'>{info}</span> {badgeLabel ? <Badge variant="default" className='mx-2 w-16 text-sm'>{badgeLabel}</Badge> : null} {isDelete ? <Trash2Icon className='text-red-500' /> : <ArrowRight />}
        </div>
    </div>;
}
