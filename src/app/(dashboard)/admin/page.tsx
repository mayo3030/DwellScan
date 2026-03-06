import { prisma } from '@/lib/db';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCents } from '@/lib/utils';
import { Users, ClipboardList, DollarSign, Shield, AlertTriangle, BarChart3 } from 'lucide-react';

export default async function AdminDashboard() {
  const [userCount, bookingCount, pendingVerification, disputeCount, totalRevenue, recentBookings] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.inspectorProfile.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.dispute.count({ where: { status: 'OPEN' } }),
    prisma.paymentRecord.aggregate({
      where: { status: 'CAPTURED' },
      _sum: { amountCents: true },
    }),
    prisma.booking.findMany({
      include: {
        clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
        inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Users" value={userCount} icon={Users} />
        <StatCard title="Bookings" value={bookingCount} icon={ClipboardList} />
        <StatCard title="Revenue" value={formatCents(totalRevenue._sum.amountCents || 0)} icon={DollarSign} />
        <StatCard title="Pending Verification" value={pendingVerification} icon={Shield} />
        <StatCard title="Open Disputes" value={disputeCount} icon={AlertTriangle} />
        <StatCard title="Platform" value="Active" icon={BarChart3} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{b.clientProfile.user.firstName} {b.clientProfile.user.lastName}</span>
                <span className="text-muted-foreground">{b.serviceType}</span>
                <span>{b.inspectorProfile.user.firstName} {b.inspectorProfile.user.lastName}</span>
                <span className="font-medium">{formatCents(b.finalTotalCents)}</span>
                <span className="text-xs text-muted-foreground">{b.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
