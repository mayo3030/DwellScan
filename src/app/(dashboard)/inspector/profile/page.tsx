'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { formatCents } from '@/lib/utils';
import { ADDON_TYPES } from '@/constants';
import { toast } from 'sonner';

export default function InspectorProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inspectors/profile')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load profile'); setLoading(false); });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/inspectors/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) toast.success('Profile updated');
      else toast.error('Failed to update profile');
    } catch {
      toast.error('Something went wrong');
    }
  }

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}</div>;
  if (!profile) return <p>Profile not found</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Inspector Profile</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your professional details shown to clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input value={profile.licenseNumber || ''} onChange={e => setProfile({...profile, licenseNumber: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input type="number" min={0} value={profile.yearsExperience} onChange={e => setProfile({...profile, yearsExperience: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea rows={4} value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell clients about your experience..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Set your base inspection price and add-on prices (in dollars)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Base Inspection Price ($)</Label>
              <Input type="number" step="0.01" min={0} value={(profile.basePriceCents / 100).toFixed(2)} onChange={e => setProfile({...profile, basePriceCents: Math.round(parseFloat(e.target.value) * 100)})} />
            </div>
            <Separator />
            <p className="text-sm font-medium">Add-on Prices</p>
            <div className="grid grid-cols-2 gap-4">
              {ADDON_TYPES.map(addon => {
                const field = addon.key + 'PriceCents';
                const fieldMap: Record<string, string> = {
                  radon: 'radonPriceCents', mold: 'moldPriceCents', termite: 'termitePriceCents',
                  sewer: 'sewerPriceCents', lead: 'leadPriceCents', oil_tank: 'oilTankPriceCents',
                };
                const priceField = fieldMap[addon.key];
                return (
                  <div key={addon.key} className="space-y-2">
                    <Label>{addon.label} ($)</Label>
                    <Input type="number" step="0.01" min={0}
                      value={((profile[priceField] || 0) / 100).toFixed(2)}
                      onChange={e => setProfile({...profile, [priceField]: Math.round(parseFloat(e.target.value) * 100)})}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg">Save Profile</Button>
      </form>
    </div>
  );
}
