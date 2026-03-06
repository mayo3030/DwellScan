'use server';

import { prisma } from '@/lib/db';
import { createSession, destroySession } from '@/lib/auth';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validators';
import { hash, compare } from 'bcryptjs';
import { redirect } from 'next/navigation';
import { createAuditLog } from '@/lib/services/audit';

const SALT_ROUNDS = 12;

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Register a new user
 */
export async function registerUser(input: RegisterInput): Promise<AuthActionResult> {
  try {
    const validated = registerSchema.parse(input);

    // Check existing user
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hash(validated.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        role: validated.role,
        status: validated.role === 'INSPECTOR' ? 'PENDING_VERIFICATION' : 'ACTIVE',
      },
    });

    // Create role-specific profile
    switch (validated.role) {
      case 'CLIENT':
        await prisma.clientProfile.create({ data: { userId: user.id } });
        break;
      case 'INSPECTOR':
        await prisma.inspectorProfile.create({ data: { userId: user.id } });
        break;
      case 'REALTOR':
        await prisma.realtorProfile.create({ data: { userId: user.id } });
        break;
    }

    await createAuditLog({
      actorId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      details: { role: validated.role },
    });

    await createSession(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.lastName,
    );

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

/**
 * Login a user
 */
export async function loginUser(input: LoginInput): Promise<AuthActionResult> {
  try {
    const validated = loginSchema.parse(input);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (user.status === 'BANNED') {
      return { success: false, error: 'Your account has been suspended' };
    }

    const passwordMatch = await compare(validated.password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    await createSession(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.lastName,
    );

    await createAuditLog({
      actorId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

/**
 * Logout the current user
 */
export async function logoutUser(): Promise<void> {
  await destroySession();
  redirect('/login');
}

