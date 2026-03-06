'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { US_STATES } from '@/constants';
import { toast } from 'sonner';

interface Address {
  id: string;
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  label?: string;
}

export default function ClientAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ street: '', unit: '', city: '', state: '', zip: '', label: '' });

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Address added');
        setDialogOpen(false);
        setForm({ street: '', unit: '', city: '', state: '', zip: '', label: '' });
        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add address');
      }
    } catch {
      toast.error('Something went wrong');
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Address removed');
        fetchAddresses();
      }
    } catch {
      toast.error('Failed to delete address');
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Label (optional)</Label>
                <Input placeholder="e.g., Home, Investment" value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input placeholder="123 Main St" value={form.street} onChange={e => setForm(f => ({...f, street: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label>Unit / Apt (optional)</Label>
                <Input placeholder="Apt 4B" value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} required />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={form.state} onValueChange={v => setForm(f => ({...f, state: v}))}>
                    <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ZIP</Label>
                  <Input placeholder="07001" value={form.zip} onChange={e => setForm(f => ({...f, zip: e.target.value}))} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Address</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="No addresses saved" description="Add your property addresses to get started with booking inspections." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{addr.label || 'Property'}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {addr.street}{addr.unit ? `, ${addr.unit}` : ''}<br />
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(addr.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
