'use client';

import { useState } from 'react';
import type { EventData, MediaItem } from '@/lib/data';
import { getSuggestions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, Tv, Loader2 } from 'lucide-react';
import Link from 'next/link';
import MediaGrid from './media-grid';
import UploadDialog from './upload-dialog';
import MediaViewerDialog from './media-viewer-dialog';
import { useToast } from "@/hooks/use-toast"

export default function EventGallery({ event }: { event: EventData }) {
    const [suggestedMedia, setSuggestedMedia] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const { toast } = useToast();

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        const mediaDescriptions = event.media.map(m => ({ mediaUrl: m.url, description: m.description }));
        
        const suggestions = await getSuggestions({
            mediaDescriptions,
            eventDescription: event.description,
        });
        
        if (suggestions.length > 0) {
            setSuggestedMedia(suggestions.map(s => s.mediaUrl));
            toast({
              title: "Suggestions Ready!",
              description: "AI has picked the best photos to feature.",
            })
        } else {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Couldn't get AI suggestions. Please try again later.",
            })
        }

        setIsLoading(false);
    };

    const handleMediaClick = (mediaItem: MediaItem) => {
        setSelectedMedia(mediaItem);
    };
    
    const handleCloseViewer = () => {
        setSelectedMedia(null);
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{event.name}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">{event.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Button onClick={() => setIsUploadOpen(true)}><Camera className="mr-2 h-4 w-4" /> Upload</Button>
                    <Button asChild variant="outline">
                        <Link href={`/events/${event.code}/live`} target="_blank">
                            <Tv className="mr-2 h-4 w-4" /> Live Display
                        </Link>
                    </Button>
                    <Button onClick={handleGetSuggestions} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90 min-w-[140px]">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? 'Thinking...' : 'Suggestions'}
                    </Button>
                </div>
            </header>
            <MediaGrid media={event.media} suggestedMediaUrls={suggestedMedia} onMediaClick={handleMediaClick} />
            <UploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
            <MediaViewerDialog mediaItem={selectedMedia} open={!!selectedMedia} onOpenChange={handleCloseViewer} />
        </div>
    );
}
