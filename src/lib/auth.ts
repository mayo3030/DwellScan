import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import type { UserRole } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production-32ch'
);
const COOKIE_NAME = 'dwellscan-session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  sessionId: string;
}

/**
 * Create a signed JWT token
 */
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  email: string,
  role: UserRole,
  firstName: string,
  lastName: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const session = await prisma.session.create({
    data: {
      userId,
      token: crypto.randomUUID(),
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  const token = await createToken({
    userId,
    email,
    role,
    firstName,
    lastName,
    sessionId: session.id,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  // Update last login
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });

  return token;
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Get session with full user data
 */
export async function getSessionWithUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      clientProfile: true,
      inspectorProfile: true,
      realtorProfile: true,
      adminProfile: true,
    },
  });

  if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
    return null;
  }

  return { session, user };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(allowedRoles?: UserRole[]) {
  const result = await getSessionWithUser();
  if (!result) {
    throw new Error('Unauthorized');
  }
  if (allowedRoles && !allowedRoles.includes(result.user.role)) {
    throw new Error('Forbidden');
  }
  return result;
}

/**
 * Destroy the current session
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  if (session?.sessionId) {
    await prisma.session.deleteMany({
      where: { id: session.sessionId },
    }).catch(() => {});
  }
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
