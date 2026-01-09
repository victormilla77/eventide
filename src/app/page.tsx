import EventAccess from '@/components/event-access';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Camera } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'event-hero');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover opacity-10"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
            <div className="p-4 bg-primary rounded-full mb-6 shadow-lg">
                <Camera className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
                Eventide Capture
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-prose">
                Your event's moments, captured and shared instantly. Join an event to start uploading and viewing photos.
            </p>
            <EventAccess />
        </div>
    </main>
  );
}
