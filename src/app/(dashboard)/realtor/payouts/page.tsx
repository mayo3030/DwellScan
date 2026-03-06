'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RealtorPayoutsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payout History</h1>
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Payout history will appear here once commissions are processed.
        </CardContent>
      </Card>
    </div>
  );
}
