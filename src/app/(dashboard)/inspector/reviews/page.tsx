import { getSessionWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function InspectorReviewsPage() {
  const result = await getSessionWithUser();
  if (!result || !result.user.inspectorProfile) redirect('/login');

  const reviews = await prisma.review.findMany({
    where: { inspectorProfileId: result.user.inspectorProfile.id },
    include: { clientProfile: { include: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reviews</h1>

      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Client reviews will appear here after completed inspections." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.rating}/5</span>
                    </div>
                    {review.title && <p className="font-medium mt-2">{review.title}</p>}
                    {review.comment && <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      By {review.clientProfile.user.firstName} {review.clientProfile.user.lastName} &bull; {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                {review.response && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium mb-1">Your response:</p>
                    <p className="text-sm">{review.response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
