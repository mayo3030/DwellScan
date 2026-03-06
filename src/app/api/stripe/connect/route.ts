import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { createConnectAccount, createAccountLink } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let accountId = result.user.inspectorProfile.stripeAccountId;

    if (!accountId) {
      const account = await createConnectAccount({
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      });
      accountId = account.id;

      await prisma.inspectorProfile.update({
        where: { id: result.user.inspectorProfile.id },
        data: { stripeAccountId: accountId },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const accountLink = await createAccountLink(
      accountId,
      `${appUrl}/inspector/settings?stripe=complete`,
      `${appUrl}/inspector/settings?stripe=refresh`,
    );

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json({ error: 'Failed to create Stripe account' }, { status: 500 });
  }
}
