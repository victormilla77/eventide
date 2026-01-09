import { MediaItem } from '@/lib/data';
import MediaCard from './media-card';

interface MediaGridProps {
  media: MediaItem[];
  suggestedMediaUrls: string[];
  onMediaClick: (mediaItem: MediaItem) => void;
}

export default function MediaGrid({ media, suggestedMediaUrls, onMediaClick }: MediaGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {media.map(item => (
                <MediaCard 
                    key={item.id} 
                    mediaItem={item} 
                    isSuggested={suggestedMediaUrls.includes(item.url)} 
                    onClick={() => onMediaClick(item)}
                />
            ))}
        </div>
    );
}
