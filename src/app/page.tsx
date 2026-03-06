import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Scan, Star, ArrowRight, CheckCircle2, Building2, Users, ChevronRight } from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/3d/hero-scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  ),
});

const MusicPlayer = dynamic(() => import('@/components/shared/music-player'), {
  ssr: false,
});

function DwellScanLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-label="DwellScan logo">
      <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
      <path d="M12 28V16L20 10L28 16V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
      <rect x="17" y="21" width="6" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
      <circle cx="20" cy="15" r="2" stroke="currentColor" strokeWidth="1.2" className="text-primary opacity-60" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Music Player */}
      <MusicPlayer />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <DwellScanLogo className="h-8 w-8" />
            <span className="font-display text-xl font-semibold tracking-wide">DwellScan</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 gold-underline">
              Inspectors
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 gold-underline">
              Pricing
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 gold-underline">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero with 3D Scene */}
      <section className="relative pt-28 pb-8 overflow-hidden">
        {/* Subtle gold radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(42,78%,55%,0.06),transparent_60%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-gold" />
              <span className="text-xs font-medium text-primary tracking-wider uppercase">Trusted by 500+ homeowners</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              Home Inspections,{' '}
              <span className="text-gold-gradient">Reimagined</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Connect with elite certified inspectors, leverage AI-powered property analysis,
              and manage every aspect of your real estate inspections — all in one refined platform.
            </p>
          </div>

          {/* 3D Scene */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <HeroScene />
          </div>

          {/* CTA Buttons below 3D scene */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 -mt-8 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            <Link href="/register">
              <Button size="lg" className="gap-2 h-12 px-8 text-sm font-medium tracking-wide">
                Book an Inspection <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-medium tracking-wide border-border/50 hover:border-primary/30">
                Browse Inspectors
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="luxury-divider mb-10" />
            <div className="grid grid-cols-3 gap-8 text-center stagger-children">
              <div>
                <div className="font-display text-3xl font-semibold text-gold-gradient">500+</div>
                <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Inspections Done</div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold text-gold-gradient">4.9</div>
                <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Average Rating</div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold text-gold-gradient">24h</div>
                <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Avg. Turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">Capabilities</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From AI-powered scans to comprehensive professional inspections, DwellScan delivers an unmatched experience.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
            {[
              { icon: Shield, title: 'Verified Inspectors', description: 'Every inspector is licensed, insured, and background-checked for your peace of mind.' },
              { icon: Scan, title: 'AI Property Scans', description: 'Upload photos for instant AI-powered property analysis and preliminary assessments.' },
              { icon: Star, title: 'Reviews & Ratings', description: 'Read verified client reviews and ratings to select the perfect inspector.' },
              { icon: Building2, title: 'Full Inspections', description: 'Book comprehensive home inspections with optional specialized add-ons.' },
              { icon: Users, title: 'Realtor Integration', description: 'Realtors can refer clients and earn commissions through our seamless portal.' },
              { icon: CheckCircle2, title: 'Secure Payments', description: 'Transparent pricing with secure Stripe-powered payment processing.' },
            ].map((feature) => (
              <Card key={feature.title} className="card-luxury bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(42,78%,55%,0.04),transparent_60%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">Process</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4">How It Works</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-0 md:grid-cols-4 stagger-children">
              {[
                { step: '01', title: 'Search', description: 'Find certified inspectors in your area' },
                { step: '02', title: 'Book', description: 'Select services and schedule your inspection' },
                { step: '03', title: 'Inspect', description: 'Your inspector conducts a thorough review' },
                { step: '04', title: 'Report', description: 'Receive a detailed inspection report' },
              ].map((item, idx) => (
                <div key={item.step} className="text-center relative px-4">
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-6 left-[60%] right-0 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                  <div className="text-xs text-primary tracking-[0.2em] font-medium mb-3">{item.step}</div>
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="luxury-divider mb-12" />
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of homeowners, inspectors, and realtors who trust DwellScan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=CLIENT">
                <Button size="lg" className="h-12 px-8 gap-2">
                  I Need an Inspection <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=INSPECTOR">
                <Button variant="outline" size="lg" className="h-12 px-8 border-border/50 hover:border-primary/30">
                  I Am an Inspector
                </Button>
              </Link>
              <Link href="/register?role=REALTOR">
                <Button variant="outline" size="lg" className="h-12 px-8 border-border/50 hover:border-primary/30">
                  I Am a Realtor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DwellScanLogo className="h-6 w-6" />
            <span className="font-display text-sm font-medium tracking-wide">DwellScan</span>
          </div>
          <p className="text-xs text-muted-foreground tracking-wide">
            &copy; {new Date().getFullYear()} DwellScan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
