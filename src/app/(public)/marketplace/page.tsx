import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Shield, Search, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getInspectors() {
  try {
    const inspectors = await prisma.user.findMany({
      where: { role: 'INSPECTOR', status: 'ACTIVE' },
      include: { inspectorProfile: true },
      take: 20,
    });
    return inspectors;
  } catch {
    return [];
  }
}

export default async function MarketplacePage() {
  const inspectors = await getInspectors();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8" aria-label="DwellScan">
              <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
              <path d="M12 28V16L20 10L28 16V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <rect x="17" y="21" width="6" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            </svg>
            <span className="font-display text-xl font-semibold tracking-wide">DwellScan</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">Marketplace</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-4">Find Your Inspector</h1>
          <p className="text-muted-foreground leading-relaxed">
            Browse our network of verified, licensed home inspectors. Every professional is background-checked and rated by real clients.
          </p>
        </div>

        {/* Inspector Grid */}
        {inspectors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
            {inspectors.map((inspector) => {
              const profile = inspector.inspectorProfile;
              if (!profile) return null;
              const cities = Array.isArray(profile.serviceAreaCities) 
                ? profile.serviceAreaCities 
                : JSON.parse(profile.serviceAreaCities as string || '[]');
              return (
                <Card key={inspector.id} className="card-luxury bg-card/50 backdrop-blur-sm group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-display text-xl">
                          {inspector.firstName} {inspector.lastName}
                        </CardTitle>
                        {profile.businessName && (
                          <p className="text-sm text-muted-foreground mt-1">{profile.businessName}</p>
                        )}
                      </div>
                      {profile.verificationStatus === 'APPROVED' && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                        <span className="font-medium tabular-nums">{profile.averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({profile.totalReviews})</span>
                      </div>
                      {cities.length > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{cities[0]}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{profile.bio}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div>
                        <span className="text-xs text-muted-foreground">Starting at</span>
                        <span className="block font-display text-lg font-semibold">
                          ${(profile.basePriceCents / 100).toFixed(0)}
                        </span>
                      </div>
                      <Link href="/register">
                        <Button size="sm" variant="outline" className="border-border/50 hover:border-primary/30 group-hover:border-primary/30">
                          Book Now <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-14 w-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-5">
              <Search className="h-6 w-6 text-primary/60" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">No inspectors found</h3>
            <p className="text-sm text-muted-foreground">Check back soon as new inspectors join our network.</p>
          </div>
        )}
      </div>
    </div>
  );
}
