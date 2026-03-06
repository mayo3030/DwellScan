import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Users } from 'lucide-react';

export default async function RealtorClientsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.realtorProfile) redirect('/login');

  const clients = await prisma.clientProfile.findMany({
    where: { referredByRealtorId: result.user.realtorProfile.id },
    include: { user: { select: { firstName: true, lastName: true, email: true, createdAt: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Referred Clients</h1>
      {clients.length === 0 ? (
        <EmptyState icon={Users} title="No referred clients" description="Clients you refer will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <p className="font-medium">{client.user.firstName} {client.user.lastName}</p>
                <p className="text-sm text-muted-foreground">{client.user.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
