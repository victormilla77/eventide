'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function EventAccess() {
    const [eventCode, setEventCode] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (eventCode.trim()) {
            router.push(`/events/${eventCode.trim()}`);
        }
    };

    return (
        <Card className="w-full max-w-md mt-8 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Join an Event</CardTitle>
                <CardDescription>Enter the code provided by the event organizer.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="e.g. EVENT24"
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                        className="flex-grow text-lg h-12"
                        aria-label="Event Code"
                    />
                    <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-12">
                        Join <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
