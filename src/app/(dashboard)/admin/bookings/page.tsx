import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { BookingStatusBadge } from '@/components/shared/status-badge';
import { formatCents, formatDate } from '@/lib/utils';

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Bookings</h1>
      <div className="space-y-3">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{b.address.street}, {b.address.city}</p>
                <p className="text-sm text-muted-foreground">
                  {b.clientProfile.user.firstName} {b.clientProfile.user.lastName} → {b.inspectorProfile.user.firstName} {b.inspectorProfile.user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatCents(b.finalTotalCents)}</span>
                <BookingStatusBadge status={b.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
