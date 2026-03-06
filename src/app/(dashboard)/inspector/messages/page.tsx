import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export default async function InspectorMessagesPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: {
      inspectorProfileId: result.user.inspectorProfile.id,
      messages: { some: {} },
    },
    include: {
      clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      address: true,
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      {bookings.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages yet" description="Conversations with clients will appear here." />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const lastMsg = booking.messages[0];
            return (
              <Link key={booking.id} href={`/inspector/bookings/${booking.id}?tab=chat`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{booking.clientProfile.user.firstName} {booking.clientProfile.user.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.address.street} &bull; {lastMsg?.content?.slice(0, 60)}{(lastMsg?.content?.length ?? 0) > 60 ? '...' : ''}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{lastMsg ? formatRelativeTime(lastMsg.createdAt) : ''}</span>
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
