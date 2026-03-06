import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function InspectorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'INSPECTOR') redirect('/login');
  return <>{children}</>;
}
