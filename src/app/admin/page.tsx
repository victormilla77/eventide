'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getEventsByOrganizer, type EventData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setEvents(getEventsByOrganizer(user.uid));
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>A list of all events you are hosting.</CardDescription>
        </div>
        <Button asChild>
            <Link href="/admin/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead className="hidden md:table-cell">Event Code</TableHead>
              <TableHead className="hidden md:table-cell">Media Count</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">{event.code}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{event.media.length}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/edit/${event.id}`}>Edit</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem>Download All Media</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {events.length === 0 && (
            <div className="text-center p-8">
                <h3 className="text-lg font-semibold">No events yet!</h3>
                <p className="text-muted-foreground text-sm">Get started by creating your first event.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
