import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ids } = await req.json();

  if (ids && Array.isArray(ids)) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: session.userId },
      data: { readAt: new Date() },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: session.userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
