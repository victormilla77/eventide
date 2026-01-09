import { Card, CardContent } from '@/components/ui/card';
import { MediaItem } from '@/lib/data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface MediaCardProps {
    mediaItem: MediaItem;
    isSuggested: boolean;
    onClick: () => void;
}

export default function MediaCard({ mediaItem, isSuggested, onClick }: MediaCardProps) {
    return (
        <Card 
            className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer",
                isSuggested && "ring-4 ring-accent ring-offset-2 ring-offset-background shadow-2xl"
            )}
            onClick={onClick}
        >
            <CardContent className="p-0 relative aspect-[4/3]">
                <Image
                    src={mediaItem.url}
                    alt={mediaItem.description}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                    data-ai-hint={mediaItem.imageHint}
                />
                {isSuggested && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground rounded-full p-1.5 shadow-lg">
                        <Star className="h-5 w-5 fill-current" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
