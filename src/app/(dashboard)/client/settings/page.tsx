'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ClientSettingsPage() {
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
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input placeholder="First name" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input placeholder="Last name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input type="tel" placeholder="Phone number" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
