import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const roleColors: Record<string, string> = {
    CLIENT: 'bg-blue-100 text-blue-800',
    INSPECTOR: 'bg-green-100 text-green-800',
    REALTOR: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Email</th>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="p-3">{user.firstName} {user.lastName}</td>
                    <td className="p-3 text-muted-foreground">{user.email}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={`${roleColors[user.role]} border-0`}>{user.role}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.status === 'ACTIVE' ? 'success' : 'destructive'}>{user.status}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
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
