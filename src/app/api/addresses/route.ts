import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { addressSchema } from '@/lib/validators';

export async function GET() {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { clientProfileId: result.user.clientProfile.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = addressSchema.parse(body);

    const address = await prisma.address.create({
      data: {
        ...validated,
        clientProfileId: result.user.clientProfile.id,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await prisma.address.deleteMany({
    where: { id, clientProfileId: result.user.clientProfile.id },
  });

  return NextResponse.json({ success: true });
}
