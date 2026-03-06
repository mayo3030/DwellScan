import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from '@/components/shared/status-badge';
import { formatCents, formatDate } from '@/lib/utils';
import { ClipboardList, Scan, MessageSquare, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function ClientDashboard() {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) redirect('/login');

  const profileId = result.user.clientProfile.id;

  const [bookingCount, aiScanCount, messageCount, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { clientProfileId: profileId } }),
    prisma.aIScan.count({ where: { clientProfileId: profileId } }),
    prisma.message.count({ where: { senderId: result.user.id } }),
    prisma.booking.findMany({
      where: { clientProfileId: profileId },
      include: {
        inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {result.user.firstName}</h1>
          <p className="text-muted-foreground">Here&apos;s an overview of your inspections</p>
        </div>
        <Link href="/marketplace">
          <Button>Book Inspection</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Bookings" value={bookingCount} icon={ClipboardList} />
        <StatCard title="AI Scans" value={aiScanCount} icon={Scan} />
        <StatCard title="Messages Sent" value={messageCount} icon={MessageSquare} />
        <StatCard title="Reports" value={recentBookings.filter(b => b.reportUploaded).length} icon={FileText} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest inspection bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No bookings yet.</p>
              <Link href="/marketplace">
                <Button variant="link">Find an inspector</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <Link key={booking.id} href={`/client/bookings/${booking.id}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{booking.address.street}, {booking.address.city}</p>
                      <p className="text-sm text-muted-foreground">
                        Inspector: {booking.inspectorProfile.user.firstName} {booking.inspectorProfile.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatDate(booking.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatCents(booking.finalTotalCents)}</span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
