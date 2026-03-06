import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { FileText, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ClientReportsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) redirect('/login');

  const bookingsWithReports = await prisma.booking.findMany({
    where: {
      clientProfileId: result.user.clientProfile.id,
      report: { isNot: null },
    },
    include: {
      report: true,
      address: true,
      inspectorProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inspection Reports</h1>

      {bookingsWithReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Inspection reports will appear here once your inspector uploads them."
        />
      ) : (
        <div className="space-y-4">
          {bookingsWithReports.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="font-medium">{booking.address.street}, {booking.address.city}</p>
                  <p className="text-sm text-muted-foreground">
                    By {booking.inspectorProfile.user.firstName} {booking.inspectorProfile.user.lastName}
                    &bull; {booking.report && formatDate(booking.report.uploadedAt)}
                  </p>
                  {booking.report?.summary && (
                    <p className="text-sm text-muted-foreground mt-1">{booking.report.summary}</p>
                  )}
                </div>
                {booking.report?.fileUrl && (
                  <a href={booking.report.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
