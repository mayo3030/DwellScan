import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { constructWebhookEvent } from '@/lib/stripe';
import { createAuditLog } from '@/lib/services/audit';
import { createNotification } from '@/lib/services/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const bookingId = pi.metadata?.bookingId;
        if (bookingId) {
          await prisma.paymentRecord.updateMany({
            where: { stripePaymentIntentId: pi.id },
            data: { status: 'CAPTURED', paidAt: new Date() },
          });

          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'SCHEDULED' },
          });

          const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { inspectorProfile: true },
          });

          if (booking) {
            await createNotification({
              userId: booking.inspectorProfile.userId,
              type: 'PAYMENT_RECEIVED',
              title: 'Payment Received',
              message: 'Client payment has been received. The inspection is now scheduled.',
              link: `/inspector/bookings/${bookingId}`,
            });
          }

          await createAuditLog({
            action: 'PAYMENT_CAPTURED',
            entityType: 'PaymentRecord',
            entityId: pi.id,
            details: { bookingId, amount: pi.amount },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await prisma.paymentRecord.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: {
            status: 'FAILED',
            failureMessage: pi.last_payment_error?.message || 'Payment failed',
          },
        });
        break;
      }

      case 'account.updated': {
        const account = event.data.object;
        await prisma.inspectorProfile.updateMany({
          where: { stripeAccountId: account.id },
          data: {
            stripeOnboarded: account.details_submitted ?? false,
            stripePayoutsEnabled: account.payouts_enabled ?? false,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
