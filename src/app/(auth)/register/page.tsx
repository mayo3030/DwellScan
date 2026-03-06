'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUser } from '@/app/actions/auth';
import { toast } from 'sonner';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'CLIENT';
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(defaultRole);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await registerUser({
        email: formData.get('email') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('password') as string,
        role: role as 'CLIENT' | 'INSPECTOR' | 'REALTOR',
        phone: (formData.get('phone') as string) || undefined,
      });
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success('Account created successfully');
        router.push(`/${role.toLowerCase()}`);
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
        <h2 className="font-display text-3xl font-semibold mb-2">Create your account</h2>
        <p className="text-sm text-muted-foreground">Join the DwellScan marketplace</p>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">First Name</Label>
                <Input id="firstName" name="firstName" required className="h-11 bg-background border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Last Name</Label>
                <Input id="lastName" name="lastName" required className="h-11 bg-background border-border/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Email</Label>
              <Input id="email" name="email" type="email" required className="h-11 bg-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="h-11 bg-background border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11 bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">Homeowner / Buyer</SelectItem>
                  <SelectItem value="INSPECTOR">Home Inspector</SelectItem>
                  <SelectItem value="REALTOR">Realtor / Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Phone (optional)</Label>
              <Input id="phone" name="phone" type="tel" className="h-11 bg-background border-border/50" />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
