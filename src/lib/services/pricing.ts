import { DEFAULT_PLATFORM_FEE_BPS, ADDON_PRICE_FIELDS, type AddonKey } from '@/constants';
import { applyBps } from '@/lib/utils';
import type { InspectorProfile, RealtorProfile } from '@prisma/client';

// ============================================
// Pricing Engine - All calculations in integer cents
// ============================================

export interface PricingBreakdown {
  basePriceCents: number;
  addonsTotalCents: number;
  addonsDetail: Array<{ key: string; label: string; priceCents: number }>;
  subtotalCents: number;
  platformFeeCents: number;
  inspectorPayoutCents: number;
  realtorCommCents: number;
  finalTotalCents: number;
}

/**
 * Calculate full pricing breakdown for a booking.
 * All amounts are in integer cents to avoid floating point issues.
 */
export function calculatePricing(params: {
  inspector: Pick<InspectorProfile,
    | 'basePriceCents'
    | 'radonPriceCents'
    | 'moldPriceCents'
    | 'termitePriceCents'
    | 'sewerPriceCents'
    | 'leadPriceCents'
    | 'oilTankPriceCents'
  >;
  addons: AddonKey[];
  realtor?: Pick<RealtorProfile, 'commissionRateBps'> | null;
  platformFeeBps?: number;
  overrideBasePriceCents?: number;
}): PricingBreakdown {
  const { inspector, addons, realtor, platformFeeBps = DEFAULT_PLATFORM_FEE_BPS, overrideBasePriceCents } = params;

  const basePriceCents = overrideBasePriceCents ?? inspector.basePriceCents;

  // Calculate addon prices
  const addonsDetail = addons.map((addonKey) => {
    const field = ADDON_PRICE_FIELDS[addonKey] as keyof typeof inspector;
    const priceCents = (inspector[field] as number) ?? 0;
    return {
      key: addonKey,
      label: addonKey.replace('_', ' '),
      priceCents,
    };
  });

  const addonsTotalCents = addonsDetail.reduce((sum, a) => sum + a.priceCents, 0);
  const subtotalCents = basePriceCents + addonsTotalCents;

  // Platform fee from subtotal
  const platformFeeCents = applyBps(subtotalCents, platformFeeBps);

  // Realtor commission from subtotal (taken from platform fee)
  const realtorCommCents = realtor
    ? applyBps(subtotalCents, realtor.commissionRateBps)
    : 0;

  // Inspector gets subtotal minus platform fee
  const inspectorPayoutCents = subtotalCents - platformFeeCents;

  // Client pays subtotal + platform fee
  const finalTotalCents = subtotalCents + platformFeeCents;

  return {
    basePriceCents,
    addonsTotalCents,
    addonsDetail,
    subtotalCents,
    platformFeeCents,
    inspectorPayoutCents,
    realtorCommCents,
    finalTotalCents,
  };
}

/**
 * Recalculate pricing with a negotiated price (replaces base price)
 */
export function calculateNegotiatedPricing(params: {
  inspector: Pick<InspectorProfile,
    | 'basePriceCents'
    | 'radonPriceCents'
    | 'moldPriceCents'
    | 'termitePriceCents'
    | 'sewerPriceCents'
    | 'leadPriceCents'
    | 'oilTankPriceCents'
  >;
  negotiatedPriceCents: number;
  addons: AddonKey[];
  realtor?: Pick<RealtorProfile, 'commissionRateBps'> | null;
  platformFeeBps?: number;
}): PricingBreakdown {
  return calculatePricing({
    ...params,
    overrideBasePriceCents: params.negotiatedPriceCents,
  });
}
