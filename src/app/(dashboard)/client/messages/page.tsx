import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default async function ClientMessagesPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) redirect('/login');

  // Get bookings that have messages
  const bookings = await prisma.booking.findMany({
    where: {
      clientProfileId: result.user.clientProfile.id,
      messages: { some: {} },
    },
    include: {
      inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      address: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Messages will appear here when you start a booking conversation."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const lastMessage = booking.messages[0];
            return (
              <Link key={booking.id} href={`/client/bookings/${booking.id}?tab=chat`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">
                        {booking.inspectorProfile.user.firstName} {booking.inspectorProfile.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.address.street} &bull; {lastMessage?.content?.slice(0, 60)}
                        {(lastMessage?.content?.length ?? 0) > 60 ? '...' : ''}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {lastMessage ? formatRelativeTime(lastMessage.createdAt) : ''}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
