'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scan, Upload, Loader2 } from 'lucide-react';
import { AI_SCAN_PRICE_CENTS } from '@/constants';
import { formatCents } from '@/lib/utils';
import { toast } from 'sonner';

export default function NewAIScanPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Array<{ id: string; street: string; city: string }>>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/addresses')
      .then(r => r.json())
      .then(data => setAddresses(data))
      .catch(() => toast.error('Failed to load addresses'));
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAddress) {
      toast.error('Please select an address');
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setLoading(true);
    try {
      // Upload files first
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'AI_SCAN_MEDIA');
        const res = await fetch('/api/uploads', { method: 'POST', body: formData });
        if (res.ok) {
          const doc = await res.json();
          uploadedUrls.push(doc.fileUrl);
        }
      }

      // Create AI scan
      const res = await fetch('/api/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddress,
          mediaUrls: uploadedUrls,
        }),
      });

      if (res.ok) {
        toast.success('AI Scan submitted! Processing will begin shortly.');
        router.push('/client/ai-scans');
      } else {
        toast.error('Failed to create AI scan');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New AI Scan</h1>
        <p className="text-muted-foreground">Upload property photos for instant AI analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            AI Property Analysis
          </CardTitle>
          <CardDescription>
            Price: {formatCents(AI_SCAN_PRICE_CENTS)} - Upload photos of the property for AI-powered condition assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select Property</Label>
              <Select value={selectedAddress} onValueChange={setSelectedAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map(addr => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.street}, {addr.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Upload Photos</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Upload photos of the property exterior, roof, foundation, etc.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="scan-photos"
                />
                <label htmlFor="scan-photos">
                  <Button type="button" variant="outline" asChild>
                    <span>Select Photos</span>
                  </Button>
                </label>
                {files.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {files.length} file(s) selected
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Submit AI Scan - {formatCents(AI_SCAN_PRICE_CENTS)}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
