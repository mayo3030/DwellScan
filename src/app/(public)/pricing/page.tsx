import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';


export default function PricingPage() {
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">Pricing</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-4">Transparent Pricing</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            No hidden fees. Every price is set by the inspector with full transparency on platform fees and payouts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* AI Scan */}
          <Card className="card-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">Quick Analysis</span>
              </div>
              <CardTitle className="font-display text-2xl font-semibold mt-2">AI Property Scan</CardTitle>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Upload photos for instant AI-powered property analysis.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="font-display text-4xl font-semibold">$99</span>
                <span className="text-muted-foreground ml-1">/ scan</span>
              </div>
              <ul className="space-y-3">
                {['Photo upload & analysis', 'AI-generated condition report', 'Risk assessment score', 'Instant results'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full h-11">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Full Inspection */}
          <Card className="card-luxury bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">Full Service</span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Popular</Badge>
              </div>
              <CardTitle className="font-display text-2xl font-semibold mt-2">Full Inspection</CardTitle>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Comprehensive on-site inspection by a certified professional.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="font-display text-4xl font-semibold">$300</span>
                <span className="text-muted-foreground ml-1">starting</span>
              </div>
              <ul className="space-y-3">
                {['Full on-site inspection', 'Detailed written report', 'Photo documentation', 'Chat & negotiation', 'Optional add-ons (radon, mold, etc.)', 'Inspector rating & reviews'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full h-11">
                  Book Inspection <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Add-ons */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-semibold">Optional Add-ons</h2>
            <p className="text-sm text-muted-foreground mt-2">Enhance your inspection with specialized testing</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Radon Testing', price: '$120 - $200' },
              { name: 'Mold Inspection', price: '$100 - $150' },
              { name: 'Termite Inspection', price: '$80 - $130' },
              { name: 'Sewer Scope', price: '$200 - $300' },
              { name: 'Lead Paint Testing', price: '$60 - $100' },
              { name: 'Oil Tank Scan', price: '$180 - $230' },
            ].map((addon) => (
              <div key={addon.name} className="rounded-lg border border-border/50 bg-card/30 p-4 hover:border-primary/20 transition-colors">
                <p className="text-sm font-medium">{addon.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
