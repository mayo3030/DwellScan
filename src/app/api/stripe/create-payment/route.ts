import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { createPaymentIntent } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { address: true },
    });

    if (!booking || booking.clientProfileId !== result.user.clientProfile.id) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'ACCEPTED' && booking.status !== 'PAYMENT_PENDING') {
      return NextResponse.json({ error: 'Booking not ready for payment' }, { status: 400 });
    }

    const paymentIntent = await createPaymentIntent({
      amountCents: booking.finalTotalCents,
      metadata: {
        bookingId: booking.id,
        clientProfileId: result.user.clientProfile.id,
      },
      description: `DwellScan inspection at ${booking.address.street}`,
    });

    // Create payment record
    await prisma.paymentRecord.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        stripePaymentIntentId: paymentIntent.id,
        amountCents: booking.finalTotalCents,
        status: 'PENDING',
      },
      update: {
        stripePaymentIntentId: paymentIntent.id,
        amountCents: booking.finalTotalCents,
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'PAYMENT_PENDING' },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}
