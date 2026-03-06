import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Scan, FileText, DollarSign, MessageSquare, Star, ChevronRight } from 'lucide-react';

export default function AboutPage() {
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
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-medium text-primary tracking-[0.2em] uppercase">About</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-6">How DwellScan Works</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-16">
            DwellScan connects homeowners, buyers, and realtors with certified home inspectors through
            a seamless, transparent platform built for the modern real estate experience.
          </p>

          {/* Roles */}
          <div className="space-y-12 mb-16">
            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">For Homeowners & Buyers</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Scan, title: 'AI Scans', desc: 'Upload property photos for instant AI analysis and risk assessment.' },
                  { icon: Shield, title: 'Verified Inspectors', desc: 'Every inspector is licensed, insured, and thoroughly vetted.' },
                  { icon: MessageSquare, title: 'Chat & Negotiate', desc: 'Communicate directly with inspectors and negotiate pricing in real-time.' },
                  { icon: FileText, title: 'Detailed Reports', desc: 'Receive comprehensive inspection reports with photos and findings.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/50 bg-card/30 p-5 hover:border-primary/20 transition-colors">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="luxury-divider" />

            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">For Inspectors</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: DollarSign, title: 'Set Your Rates', desc: 'Full control over your pricing, add-ons, and availability schedule.' },
                  { icon: Star, title: 'Build Reputation', desc: 'Earn reviews and ratings to attract more clients to your practice.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border/50 bg-card/30 p-5 hover:border-primary/20 transition-colors">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="luxury-divider" />

            <div>
              <h2 className="font-display text-2xl font-semibold mb-6">For Realtors</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Refer your clients to DwellScan and earn commissions on every completed inspection.
                Track referrals, monitor bookings, and manage payouts through your dedicated dashboard.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-12">
            <div className="luxury-divider mb-12" />
            <h2 className="font-display text-3xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">Join the DwellScan marketplace today.</p>
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 gap-2">
                Create Your Account <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
