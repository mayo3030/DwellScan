// ============================================
// Constants used throughout DwellScan
// ============================================

export const APP_NAME = 'DwellScan';

// Booking status display labels
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  PENDING_INSPECTOR: 'Pending Inspector',
  NEGOTIATING: 'Negotiating',
  ACCEPTED: 'Accepted',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_AUTHORIZED: 'Payment Authorized',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  INSPECTION_COMPLETE: 'Inspection Complete',
  REPORT_UPLOADED: 'Report Uploaded',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PENDING_INSPECTOR: 'bg-yellow-100 text-yellow-700',
  NEGOTIATING: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  PAYMENT_PENDING: 'bg-orange-100 text-orange-700',
  PAYMENT_AUTHORIZED: 'bg-emerald-100 text-emerald-700',
  SCHEDULED: 'bg-indigo-100 text-indigo-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  INSPECTION_COMPLETE: 'bg-teal-100 text-teal-700',
  REPORT_UPLOADED: 'bg-cyan-100 text-cyan-700',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
  DISPUTED: 'bg-red-200 text-red-800',
};

// Add-on types
export const ADDON_TYPES = [
  { key: 'radon', label: 'Radon Testing', description: 'Test for radon gas levels' },
  { key: 'mold', label: 'Mold Inspection', description: 'Check for mold and mildew' },
  { key: 'termite', label: 'Termite Inspection', description: 'Wood-destroying insect inspection' },
  { key: 'sewer', label: 'Sewer Scope', description: 'Video camera sewer line inspection' },
  { key: 'lead', label: 'Lead Paint Testing', description: 'Test for lead-based paint' },
  { key: 'oil_tank', label: 'Oil Tank Scan', description: 'Underground oil tank detection' },
] as const;

export type AddonKey = typeof ADDON_TYPES[number]['key'];

// Addon price field mapping on InspectorProfile
export const ADDON_PRICE_FIELDS: Record<AddonKey, string> = {
  radon: 'radonPriceCents',
  mold: 'moldPriceCents',
  termite: 'termitePriceCents',
  sewer: 'sewerPriceCents',
  lead: 'leadPriceCents',
  oil_tank: 'oilTankPriceCents',
};

// Service types
export const SERVICE_TYPES = [
  { key: 'AI_SCAN', label: 'AI Scan', description: 'Quick AI-powered property analysis from photos' },
  { key: 'FULL_INSPECTION', label: 'Full Inspection', description: 'Comprehensive on-site professional inspection' },
] as const;

// Commission tiers
export const COMMISSION_TIERS = {
  BRONZE: { label: 'Bronze', minBookings: 0, rateBps: 500 },
  SILVER: { label: 'Silver', minBookings: 10, rateBps: 700 },
  GOLD: { label: 'Gold', minBookings: 25, rateBps: 1000 },
  PLATINUM: { label: 'Platinum', minBookings: 50, rateBps: 1200 },
} as const;

// Platform fee in basis points (default 10%)
export const DEFAULT_PLATFORM_FEE_BPS = 1000;

// AI Scan base price in cents
export const AI_SCAN_PRICE_CENTS = 9900;

// Verification document requirements
export const REQUIRED_INSPECTOR_DOCS = [
  { type: 'LICENSE', label: 'Home Inspector License' },
  { type: 'INSURANCE', label: 'E&O Insurance Certificate' },
] as const;

// US States
export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
