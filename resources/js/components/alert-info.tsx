import { usePage } from '@inertiajs/react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'
import { SharedData } from '@/types';
import { useEffect, useState } from 'react';

type AlertInfoProps = {
    autoCloseDelay?: number; // milliseconds
};

export default function AlertInfo({ autoCloseDelay = 5 * 1000 }: AlertInfoProps) {
    const page = usePage<SharedData>();
    const props = page.props;
    const type = props.flash?.type || '';
    const title = props.flash?.title || '';
    const message = props.flash?.message || '';
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (props.flash) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, autoCloseDelay);

            return () => clearTimeout(timer); // Clean up on unmount or props change
        }
    }, [props.flash, autoCloseDelay]);

    if (!visible) return null;

    const iconMap = {
        info: <Info className="h-4 w-4" />,
        success: <CheckCircle2 className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <XCircle className="h-4 w-4" />,
    };

    const bgColorMap = {
        info: 'bg-blue-100 dark:bg-blue-500 border-blue-300',
        success: 'bg-green-100 dark:bg-green-500 border-green-300',
        warning: 'bg-yellow-100 dark:bg-yellow-500 border-yellow-300',
        error: 'bg-red-100 dark:bg-red-500 border-red-300',
    };

    return (
        <div className="mx-4 mt-4 mb-10 lg:mb-0">
            <Alert className={`${bgColorMap[type as keyof typeof bgColorMap] || 'bg-gray-100'}`}>
                {iconMap[type as keyof typeof iconMap] ?? <Info className="h-4 w-4" />}
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription className='dark:text-white'>
                    {message}
                </AlertDescription>
            </Alert>
        </div>
    );
}
