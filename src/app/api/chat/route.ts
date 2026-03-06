import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { sendMessageSchema } from '@/lib/validators';

export async function GET(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookingId = req.nextUrl.searchParams.get('bookingId');
  if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });

  // Verify user has access to this booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      clientProfile: true,
      inspectorProfile: true,
    },
  });

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const isClient = booking.clientProfile.userId === result.user.id;
  const isInspector = booking.inspectorProfile.userId === result.user.id;
  const isAdmin = result.user.role === 'ADMIN';

  if (!isClient && !isInspector && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { bookingId },
    include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
    orderBy: { createdAt: 'asc' },
  });

  // Mark unread messages as read
  if (isClient || isInspector) {
    await prisma.message.updateMany({
      where: {
        bookingId,
        senderId: { not: result.user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = sendMessageSchema.parse(body);

    // Verify access
    const booking = await prisma.booking.findUnique({
      where: { id: validated.bookingId },
      include: { clientProfile: true, inspectorProfile: true },
    });

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const isClient = booking.clientProfile.userId === result.user.id;
    const isInspector = booking.inspectorProfile.userId === result.user.id;

    if (!isClient && !isInspector) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        bookingId: validated.bookingId,
        senderId: result.user.id,
        type: validated.type,
        content: validated.content,
        metadata: (validated.metadata ?? undefined) as any,
      },
      include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
    });

    // Handle price offer acceptance
    if (validated.type === 'PRICE_ACCEPTED' && validated.metadata) {
      const acceptedPrice = (validated.metadata as any).offeredPriceCents;
      if (acceptedPrice && typeof acceptedPrice === 'number') {
        await prisma.booking.update({
          where: { id: validated.bookingId },
          data: {
            negotiatedPriceCents: acceptedPrice,
            priceLocked: true,
            status: 'ACCEPTED',
          },
        });
      }
    }

    // Notify the other party
    const recipientUserId = isClient ? booking.inspectorProfile.userId : booking.clientProfile.userId;
    await prisma.notification.create({
      data: {
        userId: recipientUserId,
        type: 'MESSAGE_RECEIVED',
        title: 'New Message',
        message: validated.content.slice(0, 100),
        link: isClient ? `/inspector/bookings/${booking.id}?tab=chat` : `/client/bookings/${booking.id}?tab=chat`,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 400 });
  }
}
