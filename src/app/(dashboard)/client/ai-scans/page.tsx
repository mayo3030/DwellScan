import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Scan } from 'lucide-react';
import { formatDate, formatCents } from '@/lib/utils';
import Link from 'next/link';

export default async function ClientAIScansPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) redirect('/login');

  const scans = await prisma.aIScan.findMany({
    where: { clientProfileId: result.user.clientProfile.id },
    include: { address: true },
    orderBy: { createdAt: 'desc' },
  });

  const statusColors: Record<string, string> = {
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    REVIEWED: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Scans</h1>
        <Link href="/client/ai-scans/new">
          <Button><Scan className="mr-2 h-4 w-4" />New AI Scan</Button>
        </Link>
      </div>

      {scans.length === 0 ? (
        <EmptyState
          icon={Scan}
          title="No AI scans yet"
          description="Upload property photos for an instant AI-powered analysis."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {scans.map((scan) => (
            <Card key={scan.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{scan.address.street}</CardTitle>
                <Badge variant="outline" className={statusColors[scan.status] + ' border-0'}>
                  {scan.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {scan.address.city}, {scan.address.state} &bull; {formatDate(scan.createdAt)}
                </p>
                <p className="text-sm font-medium mt-1">{formatCents(scan.priceCents)}</p>
                {scan.summary && <p className="text-sm text-muted-foreground mt-2">{scan.summary}</p>}
                {scan.confidenceScore && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Confidence: {Math.round(scan.confidenceScore * 100)}%
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
