import { z } from 'zod';

// ============================================
// Auth Validators
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
  role: z.enum(['CLIENT', 'INSPECTOR', 'REALTOR']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// Address Validators
// ============================================

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Valid ZIP code required'),
  label: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// ============================================
// Booking Validators
// ============================================

export const createBookingSchema = z.object({
  inspectorProfileId: z.string().min(1),
  addressId: z.string().min(1),
  serviceType: z.enum(['AI_SCAN', 'FULL_INSPECTION']),
  addons: z.array(z.enum(['radon', 'mold', 'termite', 'sewer', 'lead', 'oil_tank'])).default([]),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  clientNotes: z.string().max(1000).optional(),
  realtorProfileId: z.string().optional(),
});

// ============================================
// Chat Validators
// ============================================

export const sendMessageSchema = z.object({
  bookingId: z.string().min(1),
  content: z.string().min(1).max(5000),
  type: z.enum(['TEXT', 'PRICE_OFFER', 'PRICE_ACCEPTED', 'PRICE_REJECTED', 'ADDON_REQUEST', 'SYSTEM', 'AI_SUGGESTION']).default('TEXT'),
  metadata: z.record(z.unknown()).optional(),
});

export const priceOfferSchema = z.object({
  bookingId: z.string().min(1),
  offeredPriceCents: z.number().int().positive(),
  note: z.string().max(500).optional(),
});

// ============================================
// Inspector Profile Validators
// ============================================

export const inspectorProfileSchema = z.object({
  businessName: z.string().max(100).optional(),
  licenseNumber: z.string().max(50).optional(),
  yearsExperience: z.number().int().min(0).max(50).default(0),
  bio: z.string().max(2000).optional(),
  specializations: z.array(z.string()).default([]),
  serviceAreaCities: z.array(z.string()).default([]),
  serviceAreaZips: z.array(z.string()).default([]),
  serviceRadiusMiles: z.number().int().min(1).max(200).default(25),
  basePriceCents: z.number().int().positive().default(35000),
  radonPriceCents: z.number().int().min(0).default(15000),
  moldPriceCents: z.number().int().min(0).default(12000),
  termitePriceCents: z.number().int().min(0).default(10000),
  sewerPriceCents: z.number().int().min(0).default(25000),
  leadPriceCents: z.number().int().min(0).default(8000),
  oilTankPriceCents: z.number().int().min(0).default(20000),
});

export const inspectorAvailabilitySchema = z.object({
  availableMonday: z.boolean(),
  availableTuesday: z.boolean(),
  availableWednesday: z.boolean(),
  availableThursday: z.boolean(),
  availableFriday: z.boolean(),
  availableSaturday: z.boolean(),
  availableSunday: z.boolean(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

// ============================================
// Review Validators
// ============================================

export const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(2000).optional(),
});

// ============================================
// AI Scan Validators
// ============================================

export const aiScanSchema = z.object({
  addressId: z.string().min(1),
  mediaUrls: z.array(z.string().url()).min(1, 'At least one photo is required'),
  videoUrl: z.string().url().optional(),
});

// ============================================
// Admin Validators
// ============================================

export const verifyInspectorSchema = z.object({
  inspectorProfileId: z.string().min(1),
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().max(1000).optional(),
});

export const userStatusSchema = z.object({
  userId: z.string().min(1),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  reason: z.string().max(500).optional(),
});

// ============================================
// Type exports from schemas
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type PriceOfferInput = z.infer<typeof priceOfferSchema>;
export type InspectorProfileInput = z.infer<typeof inspectorProfileSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type AIScanInput = z.infer<typeof aiScanSchema>;
