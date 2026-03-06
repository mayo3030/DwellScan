export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[radial-gradient(ellipse_at_center,hsl(42,78%,55%,0.08),transparent_70%)]">
        <div className="flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8" aria-label="DwellScan">
              <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
              <path d="M12 28V16L20 10L28 16V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <rect x="17" y="21" width="6" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            </svg>
            <span className="font-display text-xl font-semibold tracking-wide">DwellScan</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
              Premium Home Inspection<br />
              <span className="text-gold-gradient">Marketplace</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Connect with certified inspectors, leverage AI-powered property analysis,
              and manage your real estate inspections with confidence.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DwellScan. All rights reserved.
          </p>
        </div>
      </div>
      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
