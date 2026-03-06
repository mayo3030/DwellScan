import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { formatCents, formatDate } from '@/lib/utils';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default async function InspectorEarningsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) redirect('/login');

  const profileId = result.user.inspectorProfile.id;

  const [completedPayouts, pendingPayouts, allPayouts] = await Promise.all([
    prisma.payout.aggregate({
      where: { inspectorProfileId: profileId, status: 'COMPLETED' },
      _sum: { amountCents: true },
      _count: true,
    }),
    prisma.payout.aggregate({
      where: { inspectorProfileId: profileId, status: { in: ['PENDING', 'APPROVED', 'PROCESSING'] } },
      _sum: { amountCents: true },
      _count: true,
    }),
    prisma.payout.findMany({
      where: { inspectorProfileId: profileId },
      include: { booking: { include: { address: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    ON_HOLD: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Earnings</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Earned" value={formatCents(completedPayouts._sum.amountCents || 0)} icon={DollarSign} description={`${completedPayouts._count} completed payouts`} />
        <StatCard title="Pending" value={formatCents(pendingPayouts._sum.amountCents || 0)} icon={Clock} description={`${pendingPayouts._count} pending payouts`} />
        <StatCard title="Completed Inspections" value={completedPayouts._count} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {allPayouts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No payouts yet.</p>
          ) : (
            <div className="space-y-3">
              {allPayouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{payout.booking.address.street}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(payout.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatCents(payout.amountCents)}</span>
                    <Badge variant="outline" className={`${statusColors[payout.status]} border-0`}>{payout.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
