import Heading from '@/components/heading';

export default function PageLayout({ children, title, description }: { children: React.ReactNode; title?: string; description?: string }) {
    return (
        <div className="lg:px-4 lg:py-6 min-h-[calc(100svh-64px)]">
            {title && <Heading title={title} description={description} />}

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <div className="flex w-full h-full">
                    <section className="w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
