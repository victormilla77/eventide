'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function NewEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCode, setEventCode] = useState('');


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically call a server action to create the event.
    // For this example, we'll just show a success toast and navigate back.
    if(eventName && eventDescription && eventCode) {
        console.log('Creating event:', { name: eventName, description: eventDescription, code: eventCode });
        toast({
            title: 'Event Created!',
            description: `The event "${eventName}" has been created.`,
        });
        router.push('/admin');
    } else {
        toast({
            variant: "destructive",
            title: 'Missing Information',
            description: `Please fill out all fields to create an event.`,
        });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
       <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Create New Event</h2>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Enter the details for your new event.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Summer Party 2025"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="A brief description of your event."
                rows={4}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="eventCode">Event Code</Label>
              <Input 
                id="eventCode" 
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                placeholder="A unique code for guests, e.g. SUM25"
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.push('/admin')}>Cancel</Button>
                <Button type="submit">Create Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
