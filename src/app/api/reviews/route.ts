import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { reviewSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.clientProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = reviewSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id: validated.bookingId },
    });

    if (!booking || booking.clientProfileId !== result.user.clientProfile.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (booking.status !== 'COMPLETED' && booking.status !== 'REPORT_UPLOADED') {
      return NextResponse.json({ error: 'Booking not completed' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId: validated.bookingId,
        clientProfileId: result.user.clientProfile.id,
        inspectorProfileId: booking.inspectorProfileId,
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment,
      },
    });

    // Update inspector average rating
    const avgResult = await prisma.review.aggregate({
      where: { inspectorProfileId: booking.inspectorProfileId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.inspectorProfile.update({
      where: { id: booking.inspectorProfileId },
      data: {
        averageRating: avgResult._avg.rating || 0,
        totalReviews: avgResult._count,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 400 });
  }
}
