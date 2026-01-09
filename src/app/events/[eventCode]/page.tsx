import { getEventByCode } from '@/lib/data';
import { notFound } from 'next/navigation';
import EventGallery from '@/components/event-gallery';
import type { Metadata } from 'next';

type Props = {
    params: { eventCode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEventByCode(params.eventCode);
 
  return {
    title: event ? `${event.name} | Eventide Capture` : 'Event Not Found',
  }
}

export default function EventPage({ params }: { params: { eventCode: string } }) {
  const event = getEventByCode(params.eventCode);

  if (!event) {
    notFound();
  }

  return <EventGallery event={event} />;
}
