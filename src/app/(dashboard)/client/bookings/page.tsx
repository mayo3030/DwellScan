import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingStatusBadge } from '@/components/shared/status-badge';
import { formatCents, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared/empty-state';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ClientBookingsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { clientProfileId: result.user.clientProfile.id },
    include: {
      inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No bookings yet"
          description="Book your first home inspection to get started."
          action={<Link href="/marketplace"><Button size="sm">Find Inspectors</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/client/bookings/${booking.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <p className="font-medium">{booking.address.street}, {booking.address.city}, {booking.address.state}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.serviceType === 'AI_SCAN' ? 'AI Scan' : 'Full Inspection'} &bull;
                      Inspector: {booking.inspectorProfile.user.firstName} {booking.inspectorProfile.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatCents(booking.finalTotalCents)}</span>
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
