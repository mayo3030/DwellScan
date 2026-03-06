import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';

export async function GET() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const docs = await prisma.uploadedDocument.findMany({
    where: { inspectorProfileId: result.user.inspectorProfile.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(docs);
}
