'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { MediaItem } from '@/lib/data';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { Airplay, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveDisplay({ media }: { media: MediaItem[] }) {
    const [api, setApi] = useState<CarouselApi>();
    const [showInstructions, setShowInstructions] = useState(true);

    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInstructions(false);
        }, 10000); // Hide instructions after 10 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-black">
             <div className={cn(
                "absolute top-8 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-white p-4 rounded-lg shadow-lg transition-opacity duration-1000",
                showInstructions ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                <div className="flex items-center gap-4">
                    <Airplay className="h-8 w-8" />
                    <div>
                        <h3 className="font-bold">Cast to your TV</h3>
                        <p className="text-sm text-white/80">Use your device's screen mirroring (AirPlay) or browser's "Cast" feature to show this on a big screen.</p>
                    </div>
                </div>
            </div>
            <Carousel setApi={setApi} className="w-full h-full" opts={{loop: true}}>
                <CarouselContent>
                    {media.map((item, index) => (
                        <CarouselItem key={item.id}>
                            <div className="relative w-screen h-screen flex items-center justify-center">
                                <Image
                                    src={item.url}
                                    alt={item.description}
                                    fill
                                    className="object-contain"
                                    data-ai-hint={item.imageHint}
                                    priority={index === 0}
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="font-headline text-2xl text-white drop-shadow-md">{item.description}</p>

                                    <p className="text-white/70 text-sm drop-shadow-md">Uploaded by {item.uploader}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
