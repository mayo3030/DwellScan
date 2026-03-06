import { prisma } from '@/lib/db';

/**
 * Create an audit log entry
 */
export async function createAuditLog(params: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      details: (params.details ?? undefined) as any,
      ipAddress: params.ipAddress,
    },
  });
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs(params: {
  actorId?: string;
  entityType?: string;
  action?: string;
  skip?: number;
  take?: number;
}) {
  const { actorId, entityType, action, skip = 0, take = 50 } = params;

  const where = {
    ...(actorId && { actorId }),
    ...(entityType && { entityType }),
    ...(action && { action }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}
