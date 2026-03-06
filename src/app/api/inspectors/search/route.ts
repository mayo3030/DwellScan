import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city = searchParams.get('city');
  const zip = searchParams.get('zip');
  const state = searchParams.get('state');
  const minRating = searchParams.get('minRating');

  const where: any = {
    verificationStatus: 'APPROVED',
    user: { status: 'ACTIVE' },
  };

  if (city) where.serviceAreaCities = { has: city };
  if (zip) where.serviceAreaZips = { has: zip };
  if (minRating) where.averageRating = { gte: parseFloat(minRating) };

  const inspectors = await prisma.inspectorProfile.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, avatarUrl: true } },
    },
    orderBy: { averageRating: 'desc' },
    take: 50,
  });

  return NextResponse.json(inspectors);
}
