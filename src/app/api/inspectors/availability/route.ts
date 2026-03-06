import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const profile = await prisma.inspectorProfile.update({
    where: { id: result.user.inspectorProfile.id },
    data: {
      availableMonday: body.availableMonday,
      availableTuesday: body.availableTuesday,
      availableWednesday: body.availableWednesday,
      availableThursday: body.availableThursday,
      availableFriday: body.availableFriday,
      availableSaturday: body.availableSaturday,
      availableSunday: body.availableSunday,
      startTime: body.startTime,
      endTime: body.endTime,
    },
  });

  return NextResponse.json(profile);
}
