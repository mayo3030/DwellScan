import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    include: { actor: { select: { firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Timestamp</th>
                  <th className="p-3 text-left font-medium">Actor</th>
                  <th className="p-3 text-left font-medium">Action</th>
                  <th className="p-3 text-left font-medium">Entity</th>
                  <th className="p-3 text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                    <td className="p-3">{log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : 'System'}</td>
                    <td className="p-3 font-mono text-xs">{log.action}</td>
                    <td className="p-3 text-muted-foreground">{log.entityType}</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
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
