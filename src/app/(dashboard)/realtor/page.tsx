import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCents } from '@/lib/utils';
import { Users, DollarSign, ClipboardList, TrendingUp } from 'lucide-react';
import { COMMISSION_TIERS } from '@/constants';

export default async function RealtorDashboard() {
  const result = await getSessionWithUser();
  if (!result || !result.user.realtorProfile) redirect('/login');

  const profile = result.user.realtorProfile;
  const profileId = profile.id;

  const [clientCount, bookingCount, totalCommission, monthlyCommission] = await Promise.all([
    prisma.clientProfile.count({ where: { referredByRealtorId: profileId } }),
    prisma.booking.count({ where: { realtorProfileId: profileId } }),
    prisma.commissionLog.aggregate({
      where: { realtorProfileId: profileId },
      _sum: { amountCents: true },
    }),
    prisma.commissionLog.aggregate({
      where: {
        realtorProfileId: profileId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { amountCents: true },
    }),
  ]);

  const tier = COMMISSION_TIERS[profile.commissionTier];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Realtor Dashboard</h1>
        <p className="text-muted-foreground">Commission Tier: {tier.label} ({tier.rateBps / 100}%)</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Referred Clients" value={clientCount} icon={Users} />
        <StatCard title="Active Bookings" value={bookingCount} icon={ClipboardList} />
        <StatCard title="Total Commission" value={formatCents(totalCommission._sum.amountCents || 0)} icon={DollarSign} />
        <StatCard title="This Month" value={formatCents(monthlyCommission._sum.amountCents || 0)} icon={TrendingUp} />
      </div>
    </div>
  );
}
