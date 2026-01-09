import { PlaceHolderImages } from '@/lib/placeholder-images';

export type MediaItem = {
  id: string;
  url: string;
  description: string;
  type: 'photo' | 'video';
  uploader: string;
  imageHint: string;
};

export type EventData = {
  id: string;
  organizerId: string;
  code: string;
  name: string;
  description: string;
  media: MediaItem[];
};

const mediaData = PlaceHolderImages.filter(img => img.id.startsWith('media-')).map((img, index) => ({
    id: img.id,
    url: img.imageUrl,
    description: img.description,
    type: 'photo' as 'photo' | 'video',
    uploader: `User ${index + 1}`,
    imageHint: img.imageHint,
}));

export const events: EventData[] = [
  {
    id: '1',
    organizerId: 'SAMPLE_USER_ID', // This would be a real user ID from Firebase Auth
    code: 'EVENT24',
    name: 'Annual Tech Summit 2024',
    description: 'A gathering of the brightest minds in technology to discuss future trends and innovations.',
    media: mediaData,
  },
];

export const getEventByCode = (code: string): EventData | undefined => {
  return events.find(event => event.code.toUpperCase() === code.toUpperCase());
};

export const getEventById = (id: string): EventData | undefined => {
  return events.find(event => event.id === id);
}

export const getAllEvents = (): EventData[] => {
  return events;
}

export const getEventsByOrganizer = (organizerId: string): EventData[] => {
    // In a real app, you would query your database.
    // For this demo, we check against a sample ID, but return all for any authenticated user.
    console.log("Searching for events for organizer:", organizerId);
    if(organizerId) {
        return events;
    }
    return [];
}
