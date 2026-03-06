import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge, BookingStatusBadge } from '@/components/shared/status-badge';
import { formatCents, formatDate } from '@/lib/utils';
import { ClipboardList, DollarSign, Star, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function InspectorDashboard() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) redirect('/login');

  const profile = result.user.inspectorProfile;
  const profileId = profile.id;

  const [bookingCount, pendingCount, totalEarnings, recentBookings] = await Promise.all([
    prisma.booking.count({ where: { inspectorProfileId: profileId } }),
    prisma.booking.count({ where: { inspectorProfileId: profileId, status: 'PENDING_INSPECTOR' } }),
    prisma.payout.aggregate({
      where: { inspectorProfileId: profileId, status: 'COMPLETED' },
      _sum: { amountCents: true },
    }),
    prisma.booking.findMany({
      where: { inspectorProfileId: profileId },
      include: {
        clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
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
          <h1 className="text-2xl font-bold">Inspector Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <VerificationBadge status={profile.verificationStatus} />
            {!profile.stripeOnboarded && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-0">Stripe Setup Required</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Bookings" value={bookingCount} icon={ClipboardList} />
        <StatCard title="Pending Requests" value={pendingCount} icon={Shield} />
        <StatCard title="Total Earnings" value={formatCents(totalEarnings._sum.amountCents || 0)} icon={DollarSign} />
        <StatCard title="Rating" value={profile.averageRating > 0 ? `${profile.averageRating.toFixed(1)}/5` : 'No reviews'} icon={Star} description={`${profile.totalReviews} reviews`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest inspection requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No bookings yet. Complete your profile to start receiving requests.</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <Link key={booking.id} href={`/inspector/bookings/${booking.id}`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{booking.address.street}, {booking.address.city}</p>
                      <p className="text-sm text-muted-foreground">
                        Client: {booking.clientProfile.user.firstName} {booking.clientProfile.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatDate(booking.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatCents(booking.inspectorPayoutCents)}</span>
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
