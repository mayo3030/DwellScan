import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCents, formatDate } from '@/lib/utils';

export default async function AdminPayoutsPage() {
  const payouts = await prisma.payout.findMany({
    include: {
      inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
      booking: { include: { address: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payout Management</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Inspector</th>
                  <th className="p-3 text-left font-medium">Property</th>
                  <th className="p-3 text-left font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-3">{p.inspectorProfile.user.firstName} {p.inspectorProfile.user.lastName}</td>
                    <td className="p-3 text-muted-foreground">{p.booking.address.street}</td>
                    <td className="p-3 font-medium">{formatCents(p.amountCents)}</td>
                    <td className="p-3"><Badge variant={p.status === 'COMPLETED' ? 'success' : 'outline'}>{p.status}</Badge></td>
                    <td className="p-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
