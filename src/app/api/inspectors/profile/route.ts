import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';

export async function GET() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(result.user.inspectorProfile);
}

export async function PUT(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const profile = await prisma.inspectorProfile.update({
      where: { id: result.user.inspectorProfile.id },
      data: {
        businessName: body.businessName,
        licenseNumber: body.licenseNumber,
        yearsExperience: body.yearsExperience,
        bio: body.bio,
        specializations: body.specializations,
        basePriceCents: body.basePriceCents,
        radonPriceCents: body.radonPriceCents,
        moldPriceCents: body.moldPriceCents,
        termitePriceCents: body.termitePriceCents,
        sewerPriceCents: body.sewerPriceCents,
        leadPriceCents: body.leadPriceCents,
        oilTankPriceCents: body.oilTankPriceCents,
        serviceAreaCities: body.serviceAreaCities,
        serviceAreaZips: body.serviceAreaZips,
        serviceRadiusMiles: body.serviceRadiusMiles,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}
