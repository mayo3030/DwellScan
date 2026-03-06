import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { createBookingSchema } from '@/lib/validators';
import { calculatePricing } from '@/lib/services/pricing';
import { createNotification } from '@/lib/services/notifications';
import { createAuditLog } from '@/lib/services/audit';
import type { AddonKey } from '@/constants';

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = createBookingSchema.parse(body);

    const inspector = await prisma.inspectorProfile.findUnique({
      where: { id: validated.inspectorProfileId },
    });

    if (!inspector || inspector.verificationStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'Inspector not available' }, { status: 400 });
    }

    // Get realtor if applicable
    let realtor = null;
    if (validated.realtorProfileId) {
      realtor = await prisma.realtorProfile.findUnique({
        where: { id: validated.realtorProfileId },
      });
    } else if (result.user.clientProfile.referredByRealtorId) {
      realtor = await prisma.realtorProfile.findUnique({
        where: { id: result.user.clientProfile.referredByRealtorId },
      });
    }

    // Calculate pricing
    const pricing = calculatePricing({
      inspector,
      addons: validated.addons as AddonKey[],
      realtor,
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientProfileId: result.user.clientProfile.id,
        inspectorProfileId: validated.inspectorProfileId,
        realtorProfileId: realtor?.id,
        addressId: validated.addressId,
        serviceType: validated.serviceType,
        status: 'PENDING_INSPECTOR',
        scheduledDate: validated.scheduledDate ? new Date(validated.scheduledDate) : undefined,
        scheduledTime: validated.scheduledTime,
        clientNotes: validated.clientNotes,
        basePriceCents: pricing.basePriceCents,
        addonsTotalCents: pricing.addonsTotalCents,
        subtotalCents: pricing.subtotalCents,
        platformFeeCents: pricing.platformFeeCents,
        inspectorPayoutCents: pricing.inspectorPayoutCents,
        realtorCommCents: pricing.realtorCommCents,
        finalTotalCents: pricing.finalTotalCents,
        addons: {
          create: pricing.addonsDetail.map((a) => ({
            name: a.key,
            priceCents: a.priceCents,
          })),
        },
      },
    });

    // Create initial chat message
    await prisma.message.create({
      data: {
        bookingId: booking.id,
        senderId: result.user.id,
        type: 'SYSTEM',
        content: `Booking request created for ${validated.serviceType === 'AI_SCAN' ? 'AI Scan' : 'Full Inspection'}.`,
      },
    });

    // Notify inspector
    await createNotification({
      userId: inspector.userId,
      type: 'BOOKING_CREATED',
      title: 'New Booking Request',
      message: `You have a new ${validated.serviceType} booking request.`,
      link: `/inspector/bookings/${booking.id}`,
    });

    await createAuditLog({
      actorId: result.user.id,
      action: 'BOOKING_CREATED',
      entityType: 'Booking',
      entityId: booking.id,
      details: { serviceType: validated.serviceType, finalTotalCents: pricing.finalTotalCents },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 400 });
  }
}
