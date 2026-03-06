import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'DwellScan — Premium Home Inspection Marketplace',
  description: 'Connect with elite certified home inspectors. Book inspections, get AI-powered property scans, and manage your real estate inspection needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
