import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-background text-center p-4">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Event Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-sm">
          Sorry, we couldn't find the event you're looking for. Please check the code and try again.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
