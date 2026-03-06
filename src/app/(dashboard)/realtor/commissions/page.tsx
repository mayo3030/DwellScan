import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCents, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared/empty-state';
import { DollarSign } from 'lucide-react';

export default async function RealtorCommissionsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.realtorProfile) redirect('/login');

  const commissions = await prisma.commissionLog.findMany({
    where: { realtorProfileId: result.user.realtorProfile.id },
    include: { booking: { include: { address: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Commission History</h1>
      {commissions.length === 0 ? (
        <EmptyState icon={DollarSign} title="No commissions yet" description="Commission records will appear here as bookings are completed." />
      ) : (
        <div className="space-y-3">
          {commissions.map((comm) => (
            <Card key={comm.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{comm.booking.address.street}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(comm.createdAt)} &bull; {comm.rateBps / 100}% rate</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatCents(comm.amountCents)}</span>
                  <Badge variant="outline" className={comm.paidOut ? 'bg-green-100 text-green-800 border-0' : 'bg-yellow-100 text-yellow-800 border-0'}>
                    {comm.paidOut ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
