import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils';

export default async function AdminInspectorsPage() {
  const inspectors = await prisma.inspectorProfile.findMany({
    include: { user: { select: { firstName: true, lastName: true, email: true, status: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inspector Management</h1>

      <div className="space-y-4">
        {inspectors.map((inspector) => (
          <Card key={inspector.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="font-medium">{inspector.user.firstName} {inspector.user.lastName}</p>
                <p className="text-sm text-muted-foreground">{inspector.user.email}</p>
                {inspector.businessName && <p className="text-sm">{inspector.businessName}</p>}
                {inspector.licenseNumber && <p className="text-xs text-muted-foreground">License: {inspector.licenseNumber}</p>}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <p>{inspector.totalReviews} reviews</p>
                  <p className="text-muted-foreground">{inspector.averageRating > 0 ? `${inspector.averageRating.toFixed(1)}/5` : 'No rating'}</p>
                </div>
                <VerificationBadge status={inspector.verificationStatus} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
