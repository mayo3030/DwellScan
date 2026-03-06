'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function InspectorServiceAreaPage() {
  const [profile, setProfile] = useState<any>(null);
  const [newZip, setNewZip] = useState('');
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inspectors/profile')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load'); setLoading(false); });
  }, []);

  function addZip() {
    if (newZip && !profile.serviceAreaZips.includes(newZip)) {
      setProfile({ ...profile, serviceAreaZips: [...profile.serviceAreaZips, newZip] });
      setNewZip('');
    }
  }

  function addCity() {
    if (newCity && !profile.serviceAreaCities.includes(newCity)) {
      setProfile({ ...profile, serviceAreaCities: [...profile.serviceAreaCities, newCity] });
      setNewCity('');
    }
  }

  function removeZip(zip: string) {
    setProfile({ ...profile, serviceAreaZips: profile.serviceAreaZips.filter((z: string) => z !== zip) });
  }

  function removeCity(city: string) {
    setProfile({ ...profile, serviceAreaCities: profile.serviceAreaCities.filter((c: string) => c !== city) });
  }

  async function handleSave() {
    try {
      const res = await fetch('/api/inspectors/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceAreaZips: profile.serviceAreaZips,
          serviceAreaCities: profile.serviceAreaCities,
          serviceRadiusMiles: profile.serviceRadiusMiles,
        }),
      });
      if (res.ok) toast.success('Service area updated');
      else toast.error('Failed to update');
    } catch {
      toast.error('Something went wrong');
    }
  }

  if (loading) return <div className="h-96 bg-muted animate-pulse rounded-lg" />;
  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Service Area</h1>

      <Card>
        <CardHeader>
          <CardTitle>Service Radius</CardTitle>
          <CardDescription>Define how far you are willing to travel for inspections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Radius (miles)</Label>
            <Input type="number" min={1} max={200} value={profile.serviceRadiusMiles}
              onChange={e => setProfile({...profile, serviceRadiusMiles: parseInt(e.target.value) || 25})} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ZIP Codes</CardTitle>
          <CardDescription>Add specific ZIP codes you serve</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter ZIP code" value={newZip} onChange={e => setNewZip(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addZip())} />
            <Button onClick={addZip} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.serviceAreaZips.map((zip: string) => (
              <Badge key={zip} variant="secondary" className="gap-1">
                {zip}
                <button onClick={() => removeZip(zip)}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cities</CardTitle>
          <CardDescription>Add cities you serve</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter city name" value={newCity} onChange={e => setNewCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCity())} />
            <Button onClick={addCity} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.serviceAreaCities.map((city: string) => (
              <Badge key={city} variant="secondary" className="gap-1">
                {city}
                <button onClick={() => removeCity(city)}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} size="lg">Save Service Area</Button>
    </div>
  );
}
