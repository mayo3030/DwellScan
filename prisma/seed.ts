// DwellScan Database Seed Script
// Run: npx tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DwellScan database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.commissionLog.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inspectionReport.deleteMany();
  await prisma.bookingAddon.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.aIScan.deleteMany();
  await prisma.availabilityException.deleteMany();
  await prisma.uploadedDocument.deleteMany();
  await prisma.address.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.inspectorProfile.deleteMany();
  await prisma.realtorProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash('Password1', 12);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dwellscan.com',
      passwordHash: password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      adminProfile: { create: { isSuperAdmin: true } },
    },
  });
  console.log('Created admin:', admin.email);

  // Create Inspectors
  const inspectors = [];
  const inspectorData = [
    { first: 'James', last: 'Wilson', business: 'Wilson Home Inspections', city: 'Newark', state: 'NJ', zip: '07102', years: 12, bio: 'Certified home inspector with 12 years of experience in Northern New Jersey. ASHI certified with expertise in older homes and new construction.' },
    { first: 'Maria', last: 'Gonzalez', business: 'Precision Property Inspections', city: 'Jersey City', state: 'NJ', zip: '07302', years: 8, bio: 'Licensed NJ home inspector specializing in condos, multi-family properties, and commercial spaces. Bilingual English/Spanish.' },
    { first: 'Robert', last: 'Chen', business: 'Chen Inspection Services', city: 'Brooklyn', state: 'NY', zip: '11201', years: 15, bio: 'Master inspector with 15 years experience. Thermal imaging certified. Specializing in Brooklyn brownstones and pre-war buildings.' },
    { first: 'Sarah', last: 'Thompson', business: 'ProCheck Home Inspections', city: 'Edison', state: 'NJ', zip: '08817', years: 6, bio: 'Dedicated home inspector focused on Central NJ. InterNACHI certified with radon and mold specializations.' },
    { first: 'David', last: 'Park', business: null, city: 'Hoboken', state: 'NJ', zip: '07030', years: 10, bio: 'Full-service home inspection professional serving Hudson County and surrounding areas.' },
  ];

  for (const data of inspectorData) {
    const user = await prisma.user.create({
      data: {
        email: `${data.first.toLowerCase()}.${data.last.toLowerCase()}@example.com`,
        passwordHash: password,
        firstName: data.first,
        lastName: data.last,
        role: 'INSPECTOR',
        status: 'ACTIVE',
        emailVerified: true,
        inspectorProfile: {
          create: {
            businessName: data.business,
            licenseNumber: `NJ-HI-${Math.floor(10000 + Math.random() * 90000)}`,
            yearsExperience: data.years,
            bio: data.bio,
            verificationStatus: 'APPROVED',
            verifiedAt: new Date(),
            serviceAreaCities: [data.city],
            serviceAreaZips: [data.zip],
            serviceRadiusMiles: 25,
            basePriceCents: 30000 + Math.floor(Math.random() * 20000),
            radonPriceCents: 12000 + Math.floor(Math.random() * 8000),
            moldPriceCents: 10000 + Math.floor(Math.random() * 5000),
            termitePriceCents: 8000 + Math.floor(Math.random() * 5000),
            sewerPriceCents: 20000 + Math.floor(Math.random() * 10000),
            leadPriceCents: 6000 + Math.floor(Math.random() * 4000),
            oilTankPriceCents: 18000 + Math.floor(Math.random() * 5000),
            averageRating: 3.5 + Math.random() * 1.5,
            totalReviews: Math.floor(5 + Math.random() * 45),
            stripeOnboarded: true,
            stripePayoutsEnabled: true,
          },
        },
      },
      include: { inspectorProfile: true },
    });
    inspectors.push(user);
    console.log('Created inspector:', user.email);
  }

  // Create Realtor
  const realtor = await prisma.user.create({
    data: {
      email: 'lisa.martinez@example.com',
      passwordHash: password,
      firstName: 'Lisa',
      lastName: 'Martinez',
      role: 'REALTOR',
      emailVerified: true,
      realtorProfile: {
        create: {
          agencyName: 'Metro Realty Group',
          licenseNumber: 'NJ-RE-87654',
          commissionTier: 'SILVER',
          commissionRateBps: 700,
        },
      },
    },
    include: { realtorProfile: true },
  });
  console.log('Created realtor:', realtor.email);

  // Create Clients
  const clients = [];
  const clientData = [
    { first: 'Michael', last: 'Johnson', email: 'michael.johnson@example.com' },
    { first: 'Emily', last: 'Davis', email: 'emily.davis@example.com' },
    { first: 'Alex', last: 'Rivera', email: 'alex.rivera@example.com' },
  ];

  for (const data of clientData) {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: password,
        firstName: data.first,
        lastName: data.last,
        role: 'CLIENT',
        emailVerified: true,
        clientProfile: {
          create: {
            referredByRealtorId: data.first === 'Emily' ? realtor.realtorProfile!.id : undefined,
          },
        },
      },
      include: { clientProfile: true },
    });
    clients.push(user);
    console.log('Created client:', user.email);
  }

  // Create Addresses
  const addresses = [];
  const addressData = [
    { street: '123 Oak Street', city: 'Newark', state: 'NJ', zip: '07102', label: 'Home' },
    { street: '456 Maple Avenue', city: 'Jersey City', state: 'NJ', zip: '07302', label: 'Investment Property' },
    { street: '789 Pine Road', city: 'Edison', state: 'NJ', zip: '08817', label: 'New Purchase' },
    { street: '321 Elm Boulevard', city: 'Hoboken', state: 'NJ', zip: '07030', label: 'Condo' },
  ];

  for (let i = 0; i < addressData.length; i++) {
    const clientIdx = i % clients.length;
    const addr = await prisma.address.create({
      data: {
        ...addressData[i],
        clientProfileId: clients[clientIdx].clientProfile!.id,
      },
    });
    addresses.push(addr);
  }
  console.log(`Created ${addresses.length} addresses`);

  // Create Bookings
  const bookingData = [
    { clientIdx: 0, inspectorIdx: 0, addrIdx: 0, status: 'COMPLETED' as const, service: 'FULL_INSPECTION' as const },
    { clientIdx: 1, inspectorIdx: 1, addrIdx: 1, status: 'SCHEDULED' as const, service: 'FULL_INSPECTION' as const },
    { clientIdx: 2, inspectorIdx: 2, addrIdx: 2, status: 'PENDING_INSPECTOR' as const, service: 'FULL_INSPECTION' as const },
    { clientIdx: 0, inspectorIdx: 3, addrIdx: 3, status: 'NEGOTIATING' as const, service: 'FULL_INSPECTION' as const },
  ];

  for (const bd of bookingData) {
    const inspector = inspectors[bd.inspectorIdx].inspectorProfile!;
    const basePriceCents = inspector.basePriceCents;
    const platformFeeCents = Math.round(basePriceCents * 0.1);
    const inspectorPayoutCents = basePriceCents - platformFeeCents;

    const realtorId = bd.clientIdx === 1 ? realtor.realtorProfile!.id : undefined;
    const realtorComm = realtorId ? Math.round(basePriceCents * 0.07) : 0;

    const booking = await prisma.booking.create({
      data: {
        clientProfileId: clients[bd.clientIdx].clientProfile!.id,
        inspectorProfileId: inspector.id,
        realtorProfileId: realtorId,
        addressId: addresses[bd.addrIdx].id,
        serviceType: bd.service,
        status: bd.status,
        scheduledDate: bd.status === 'SCHEDULED' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
        scheduledTime: bd.status === 'SCHEDULED' ? '10:00' : undefined,
        basePriceCents,
        addonsTotalCents: 0,
        subtotalCents: basePriceCents,
        platformFeeCents,
        inspectorPayoutCents,
        realtorCommCents: realtorComm,
        finalTotalCents: basePriceCents + platformFeeCents,
        priceLocked: bd.status === 'COMPLETED' || bd.status === 'SCHEDULED',
      },
    });

    // Add chat messages
    await prisma.message.createMany({
      data: [
        {
          bookingId: booking.id,
          senderId: clients[bd.clientIdx].id,
          type: 'SYSTEM',
          content: 'Booking request created.',
        },
        {
          bookingId: booking.id,
          senderId: clients[bd.clientIdx].id,
          type: 'TEXT',
          content: 'Hi, I am interested in getting an inspection for this property. Is the date flexible?',
        },
      ],
    });

    // Add review for completed booking
    if (bd.status === 'COMPLETED') {
      await prisma.review.create({
        data: {
          clientProfileId: clients[bd.clientIdx].clientProfile!.id,
          inspectorProfileId: inspector.id,
          bookingId: booking.id,
          rating: 5,
          title: 'Excellent inspection',
          comment: 'Very thorough and professional. Highly recommended!',
        },
      });

      await prisma.payout.create({
        data: {
          inspectorProfileId: inspector.id,
          bookingId: booking.id,
          amountCents: inspectorPayoutCents,
          status: 'COMPLETED',
          processedAt: new Date(),
        },
      });

      if (realtorId) {
        await prisma.commissionLog.create({
          data: {
            realtorProfileId: realtorId,
            bookingId: booking.id,
            amountCents: realtorComm,
            rateBps: 700,
            tier: 'SILVER',
            paidOut: true,
            paidOutAt: new Date(),
          },
        });
      }
    }
  }
  console.log('Created bookings with messages and reviews');

  // Create AI Scan
  await prisma.aIScan.create({
    data: {
      clientProfileId: clients[0].clientProfile!.id,
      addressId: addresses[0].id,
      status: 'COMPLETED',
      mediaUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
      priceCents: 9900,
      confidenceScore: 0.87,
      summary: 'Property appears in good overall condition. Minor concerns noted with roof shingles and gutter alignment. Foundation appears solid. Recommend full inspection for detailed assessment.',
      resultJson: {
        overallScore: 87,
        categories: {
          roof: { score: 72, notes: 'Some shingle wear visible' },
          foundation: { score: 95, notes: 'Good condition' },
          exterior: { score: 85, notes: 'Minor paint peeling on south side' },
          windows: { score: 90, notes: 'Windows appear well-sealed' },
        },
      },
    },
  });
  console.log('Created AI scan');

  // Create Notifications
  for (const client of clients) {
    await prisma.notification.create({
      data: {
        userId: client.id,
        type: 'SYSTEM',
        title: 'Welcome to DwellScan',
        message: 'Your account has been created. Start by adding your property address.',
        link: '/client/addresses',
      },
    });
  }

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: 'USER_REGISTERED', entityType: 'User', entityId: admin.id },
      { actorId: admin.id, action: 'INSPECTOR_VERIFIED', entityType: 'InspectorProfile', entityId: inspectors[0].inspectorProfile!.id },
      { actorId: clients[0].id, action: 'BOOKING_CREATED', entityType: 'Booking', details: { serviceType: 'FULL_INSPECTION' } },
    ],
  });
  console.log('Created audit logs');

  console.log('\nSeed completed successfully!');
  console.log('\nTest accounts (all passwords: Password1):');
  console.log('  Admin:     admin@dwellscan.com');
  console.log('  Inspector: james.wilson@example.com');
  console.log('  Client:    michael.johnson@example.com');
  console.log('  Realtor:   lisa.martinez@example.com');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
