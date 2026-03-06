import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { AI_SCAN_PRICE_CENTS } from '@/constants';
import { createAuditLog } from '@/lib/services/audit';

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { addressId, mediaUrls, videoUrl } = await req.json();

    if (!addressId || !mediaUrls || mediaUrls.length === 0) {
      return NextResponse.json({ error: 'Address and at least one photo required' }, { status: 400 });
    }

    // Verify address belongs to client
    const address = await prisma.address.findFirst({
      where: { id: addressId, clientProfileId: result.user.clientProfile.id },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const scan = await prisma.aIScan.create({
      data: {
        clientProfileId: result.user.clientProfile.id,
        addressId,
        mediaUrls,
        videoUrl,
        priceCents: AI_SCAN_PRICE_CENTS,
        status: 'PROCESSING',
      },
    });

    // In production, this would trigger actual AI processing
    // For now, simulate completion after a delay using a placeholder
    // The processing would be handled by a background job

    await createAuditLog({
      actorId: result.user.id,
      action: 'AI_SCAN_CREATED',
      entityType: 'AIScan',
      entityId: scan.id,
    });

    return NextResponse.json(scan, { status: 201 });
  } catch (error) {
    console.error('AI Scan error:', error);
    return NextResponse.json({ error: 'Failed to create AI scan' }, { status: 500 });
  }
}
