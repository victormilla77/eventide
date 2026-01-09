'use client';

import { useState, useEffect } from 'react';
import { getEventById } from '@/lib/data';
import type { EventData } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [eventUrl, setEventUrl] = useState('');

  useEffect(() => {
    const foundEvent = getEventById(params.id);
    if (foundEvent) {
      setEvent(foundEvent);
      // Ensure window is defined before using it
      if (typeof window !== 'undefined') {
        const url = `${window.location.origin}/events/${foundEvent.code}`;
        setEventUrl(url);
      }
    } else {
      notFound();
    }
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (event) {
      // Here you would typically call a server action to save the data.
      // For this example, we'll just show a success toast.
      console.log('Saving event:', event);
      toast({
        title: 'Event Saved!',
        description: `Changes to "${event.name}" have been saved.`,
      });
      router.push('/admin');
    }
  };
  
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
        window.print();
    }
  }

  if (!event) {
    // This can show a loading skeleton or similar
    return <div>Loading...</div>;
  }

  return (
    <>
        <style jsx global>{`
            @media print {
                body * {
                    visibility: hidden;
                }
                #printable, #printable * {
                    visibility: visible;
                }
                #printable {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .no-print {
                  display: none;
                }
            }
        `}</style>
        <div id="printable">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">{event.name}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <p className="text-lg font-bold">Scan to join!</p>
                    {eventUrl ? (
                        <div className="p-4 bg-white rounded-lg border">
                            <QRCodeSVG value={eventUrl} size={256} />
                        </div>
                    ) : (
                        <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">Generating QR...</p>
                        </div>
                    )}
                    <p className="font-mono text-2xl font-bold tracking-widest bg-secondary text-secondary-foreground px-4 py-2 rounded-md">{event.code}</p>
                </CardContent>
            </Card>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
                <span className="sr-only">Back</span>
                </Button>
                <h2 className="text-2xl font-bold text-foreground">Edit Event</h2>
            </div>
            <Card>
            <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Update the name and description for your event.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                    id="eventName"
                    value={event.name}
                    onChange={(e) => setEvent({ ...event, name: e.target.value })}
                    className="text-lg"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="eventDescription">Event Description</Label>
                    <Textarea
                    id="eventDescription"
                    value={event.description}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    rows={4}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="eventCode">Event Code</Label>
                    <Input id="eventCode" value={event.code} disabled />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => router.push('/admin')}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
                </form>
            </CardContent>
            </Card>
        </div>
        <div>
            <div className="flex items-center gap-4 mb-6 h-[40px]" />
            <Card>
                <CardHeader>
                    <CardTitle>Event QR Code</CardTitle>
                    <CardDescription>Guests can scan this to access the event gallery.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                    {eventUrl ? (
                        <div className="p-4 bg-white rounded-lg">
                            <QRCodeSVG value={eventUrl} size={192} />
                        </div>
                    ) : (
                        <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">Generating QR...</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button onClick={handlePrint} className="w-full">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Flyer
                    </Button>
                </CardFooter>
            </Card>
        </div>
        </div>
    </>
  );
}
