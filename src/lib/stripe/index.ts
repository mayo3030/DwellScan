import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // @ts-expect-error Stripe API version may differ from installed types
  apiVersion: '2024-10-28.acacia',
  typescript: true,
});

/**
 * Create a Stripe Connect Express account for an inspector
 */
export async function createConnectAccount(params: {
  email: string;
  firstName: string;
  lastName: string;
}): Promise<Stripe.Account> {
  return stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: params.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    individual: {
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
    },
  });
}

/**
 * Create an onboarding link for Stripe Connect
 */
export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string,
): Promise<Stripe.AccountLink> {
  return stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  });
}

/**
 * Create a payment intent for a booking.
 * We use automatic capture since inspections may happen days later.
 * The amount is charged immediately and held until payout.
 */
export async function createPaymentIntent(params: {
  amountCents: number;
  customerId?: string;
  metadata: Record<string, string>;
  description: string;
}): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: params.amountCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: params.metadata,
    description: params.description,
  });
}

/**
 * Create a transfer to an inspector's Connected account
 */
export async function createTransfer(params: {
  amountCents: number;
  destinationAccountId: string;
  bookingId: string;
}): Promise<Stripe.Transfer> {
  return stripe.transfers.create({
    amount: params.amountCents,
    currency: 'usd',
    destination: params.destinationAccountId,
    metadata: {
      bookingId: params.bookingId,
    },
  });
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amountCents?: number,
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountCents ? { amount: amountCents } : {}),
  });
}

/**
 * Retrieve account details to check onboarding status
 */
export async function getAccountStatus(accountId: string): Promise<{
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}> {
  const account = await stripe.accounts.retrieve(accountId);
  return {
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
  };
}

/**
 * Construct and verify a Stripe webhook event
 */
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}
