
import { Check, X } from 'lucide-react'; // Pastikan Anda sudah menginstal 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Feature } from '@/types';


export default function PricingCard({ plan, price, description, features, ctaText, ctaVariant = 'default', isHighlighted = false, isYearly = false, onclick }: { plan: string, price: number, description: string, features: Feature[], ctaText: string, ctaVariant: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined, isHighlighted: boolean, isYearly: boolean, onclick: () => void }) {
    return (
        <Card className={`relative flex flex-col justify-between ${isHighlighted ? 'border-primary-500 ring-2 ring-primary-500' : ''}`}>
            {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                    Terpopuler
                </div>
            )}
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">{plan}</CardTitle>
                <CardDescription className="text-muted-foreground">{description}</CardDescription>
                <div className="mt-4">
                    <span className="text-5xl font-bold">Rp {Number(price/1000).toLocaleString('id-ID')}k</span>
                    <span className="text-muted-foreground">/{isYearly ? 'tahun' : 'bulan'}</span>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            {feature.available ? (
                                <Check className="h-5 w-5 text-green-500" />
                            ) : (
                                <X className="h-5 w-5 text-red-500" />
                            )}
                            <span className={feature.available ? '' : 'line-through text-muted-foreground'}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="mt-8">
                <Button className="w-full" variant={ctaVariant} onClick={onclick}>
                    {ctaText}
                </Button>
            </CardFooter>
        </Card>
    );
}