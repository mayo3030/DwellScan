'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import { REQUIRED_INSPECTOR_DOCS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function InspectorDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inspectors/documents')
      .then(r => r.json())
      .then(data => { setDocuments(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load'); setLoading(false); });
  }, []);

  async function handleUpload(type: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      try {
        const res = await fetch('/api/uploads', { method: 'POST', body: formData });
        if (res.ok) {
          toast.success('Document uploaded');
          // Refresh
          const data = await (await fetch('/api/inspectors/documents')).json();
          setDocuments(data);
        } else {
          toast.error('Upload failed');
        }
      } catch {
        toast.error('Something went wrong');
      }
    };
    input.click();
  }

  if (loading) return <div className="h-96 bg-muted animate-pulse rounded-lg" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verification Documents</h1>
      <p className="text-muted-foreground">Upload your license and insurance documents for verification.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {REQUIRED_INSPECTOR_DOCS.map((req) => {
          const doc = documents.find(d => d.type === req.type);
          return (
            <Card key={req.type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{req.label}</CardTitle>
                  {doc ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={doc.verified ? 'bg-green-100 text-green-800 border-0' : 'bg-yellow-100 text-yellow-800 border-0'}>
                        {doc.verified ? 'Verified' : 'Pending Review'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{doc.fileName}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Not uploaded</p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUpload(req.type)}>
                  <Upload className="mr-2 h-4 w-4" />{doc ? 'Replace' : 'Upload'}
                </Button>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
