import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/shared/empty-state';
import { AlertTriangle } from 'lucide-react';

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    include: {
      booking: {
        include: {
          clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
          inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
          address: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disputes</h1>
      {disputes.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No disputes" description="All clear - no open disputes at this time." />
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{d.reason}</p>
                    <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {d.booking.clientProfile.user.firstName} {d.booking.clientProfile.user.lastName} vs {d.booking.inspectorProfile.user.firstName} {d.booking.inspectorProfile.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.booking.address.street} &bull; {formatDate(d.createdAt)}</p>
                  </div>
                  <Badge variant={d.status === 'OPEN' ? 'destructive' : 'outline'}>{d.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
