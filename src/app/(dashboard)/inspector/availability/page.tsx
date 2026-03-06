'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function InspectorAvailabilityPage() {
  const [availability, setAvailability] = useState({
    availableMonday: true, availableTuesday: true, availableWednesday: true,
    availableThursday: true, availableFriday: true, availableSaturday: false,
    availableSunday: false, startTime: '08:00', endTime: '17:00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inspectors/profile')
      .then(r => r.json())
      .then(data => {
        setAvailability({
          availableMonday: data.availableMonday, availableTuesday: data.availableTuesday,
          availableWednesday: data.availableWednesday, availableThursday: data.availableThursday,
          availableFriday: data.availableFriday, availableSaturday: data.availableSaturday,
          availableSunday: data.availableSunday, startTime: data.startTime, endTime: data.endTime,
        });
        setLoading(false);
      })
      .catch(() => { toast.error('Failed to load'); setLoading(false); });
  }, []);

  async function handleSave() {
    try {
      const res = await fetch('/api/inspectors/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availability),
      });
      if (res.ok) toast.success('Availability updated');
      else toast.error('Failed to update');
    } catch {
      toast.error('Something went wrong');
    }
  }

  if (loading) return <div className="h-96 bg-muted animate-pulse rounded-lg" />;

  const dayFields = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
    day,
    field: `available${day}` as keyof typeof availability,
  }));

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Availability</h1>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Set the days and hours you are available for inspections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={availability.startTime} onChange={e => setAvailability(a => ({...a, startTime: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" value={availability.endTime} onChange={e => setAvailability(a => ({...a, endTime: e.target.value}))} />
            </div>
          </div>

          <div className="space-y-4">
            {dayFields.map(({ day, field }) => (
              <div key={day} className="flex items-center justify-between">
                <Label className="text-base">{day}</Label>
                <Switch
                  checked={availability[field] as boolean}
                  onCheckedChange={(checked) => setAvailability(a => ({...a, [field]: checked}))}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSave}>Save Availability</Button>
        </CardContent>
      </Card>
    </div>
  );
}
