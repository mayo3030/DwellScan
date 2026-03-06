'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { loginUser } from '@/app/actions/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      const result = await loginUser({ email, password });
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        // Route to the correct dashboard based on user role
        const roleDashboardMap: Record<string, string> = {
          CLIENT: '/client',
          INSPECTOR: '/inspector',
          REALTOR: '/realtor',
          ADMIN: '/admin',
        };
        const destination = roleDashboardMap[result.role ?? ''] ?? '/client';
        router.push(destination);
        router.refresh();
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-semibold mb-2">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your DwellScan account</p>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="h-11 bg-background border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Password</Label>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="h-11 bg-background border-border/50 focus:border-primary/50"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Do not have an account?{' '}
        <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
