import { prisma } from '@/lib/db';
import type { NotificationType } from '@prisma/client';

/**
 * Create a notification for a user
 */
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      metadata: (params.metadata ?? undefined) as any,
    },
  });
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

/**
 * Mark notifications as read
 */
export async function markAsRead(notificationIds: string[], userId: string) {
  return prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId,
    },
    data: { readAt: new Date() },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
