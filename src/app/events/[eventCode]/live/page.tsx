import { getEventByCode } from '@/lib/data';
import { notFound } from 'next/navigation';
import LiveDisplay from '@/components/live-display';
import type { Metadata } from 'next';

type Props = {
    params: { eventCode: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEventByCode(params.eventCode);
 
  return {
    title: event ? `Live Display: ${event.name}` : 'Event Not Found',
  }
}

export default function LiveDisplayPage({ params }: { params: { eventCode:string } }) {
  const event = getEventByCode(params.eventCode);

  if (!event) {
    notFound();
  }

  return <LiveDisplay media={event.media} />;
}
