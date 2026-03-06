import { redirect } from 'next/navigation';
import { getSessionWithUser } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getSessionWithUser();
  if (!result) redirect('/login');

  const { user } = result;

  return (
    <DashboardLayout
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
