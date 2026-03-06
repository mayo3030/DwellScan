'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InspectorSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input placeholder="First name" /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Last name" /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input type="tel" placeholder="Phone number" /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
