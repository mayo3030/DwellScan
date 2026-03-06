import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BookingStatusBadge } from '@/components/shared/status-badge';
import { formatCents, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared/empty-state';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default async function InspectorBookingsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { inspectorProfileId: result.user.inspectorProfile.id },
    include: {
      clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No bookings yet" description="Bookings from clients will appear here." />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/inspector/bookings/${booking.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <p className="font-medium">{booking.address.street}, {booking.address.city}</p>
                    <p className="text-sm text-muted-foreground">
                      Client: {booking.clientProfile.user.firstName} {booking.clientProfile.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatCents(booking.inspectorPayoutCents)}</span>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
