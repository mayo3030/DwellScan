# DwellScan — Premium Home Inspection Marketplace

A full-stack real estate inspection marketplace built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Frontend:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **3D:** Three.js, React Three Fiber, Drei
- **Audio:** Howler.js for ambient background music
- **Database:** PostgreSQL 17 + Prisma ORM (20 models, 15 enums)
- **Fonts:** Cormorant Garamond (display) + Inter (body)
- **Theme:** Dark navy (#0a0c10) + Gold (#c9a24a) luxury design

## Features

- 4 user roles: Client, Inspector, Realtor, Admin
- Full booking workflow with pricing engine
- AI-powered property scans
- Chat & negotiation system
- Stripe Connect payments, inspector payouts, realtor commissions
- 3D animated hero scene with floating house model
- Ambient background music with mute/unmute toggle
- Responsive luxury dark theme

## Setup

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Set Up PostgreSQL
```bash
# Create database
createdb dwellscan
# Or use Docker:
docker run -d --name dwellscan-db -e POSTGRES_DB=dwellscan -e POSTGRES_USER=dwellscan -e POSTGRES_PASSWORD=dwellscan123 -p 5432:5432 postgres:17
```

### 3. Configure Environment
Create `.env` file:
```
DATABASE_URL="postgresql://dwellscan:dwellscan123@localhost:5432/dwellscan"
NEXTAUTH_SECRET="your-secret-here"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 4. Run Prisma Migrations & Seed
```bash
npx prisma db push
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

### Test Accounts (password: `Password1`)
- **Admin:** admin@dwellscan.com
- **Inspector:** james.wilson@example.com
- **Client:** michael.johnson@example.com
- **Realtor:** lisa.martinez@example.com

## Project Structure

```
dwellscan/
├── prisma/           # Schema + seed data
├── public/           # Static assets (ambient.mp3)
├── src/
│   ├── app/          # Next.js App Router pages & API routes
│   │   ├── (auth)/   # Login & Register
│   │   ├── (dashboard)/ # Role-based dashboards
│   │   ├── (public)/ # Marketplace, Pricing, About
│   │   └── api/      # REST API endpoints
│   ├── components/   # React components
│   │   ├── 3d/       # Three.js hero scene
│   │   ├── layout/   # Dashboard layout
│   │   ├── shared/   # Music player, etc.
│   │   └── ui/       # shadcn/ui components
│   ├── lib/          # Utilities (Prisma client, auth, etc.)
│   └── middleware.ts  # Auth middleware
├── proxy-server.js   # Express proxy for deployment
└── postbuild.sh      # Post-build CSS/JS fix script
```
