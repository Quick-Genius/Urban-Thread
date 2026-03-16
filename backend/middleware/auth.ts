import { getAuth, clerkClient } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import cache from '../config/redis';
import ApiError from '../utils/ApiError';
import asyncHandler from '../utils/asyncHandler';

const USER_CACHE_TTL = 300;
const userCacheKey = (clerkId: string) => `user:${clerkId}`;

export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError('Not authorised — please sign in', 401);
  }

  const cached = await cache.get(userCacheKey(userId));
  if (cached) {
    const user = cached as typeof req.user;
    if (!user?.isActive) {
      throw new ApiError('Your account has been deactivated. Please contact support.', 403);
    }
    req.user = user;
    return next();
  }

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId);

    const primaryEmail =
      clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
        ?.emailAddress ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      '';

    const fullName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'User';

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        name: fullName,
        email: primaryEmail,
        avatar: clerkUser.imageUrl || '',
        role: ((clerkUser.publicMetadata?.role as string) || 'customer') as 'customer' | 'seller' | 'admin',
      },
    });
  }

  if (!user.isActive) {
    throw new ApiError('Your account has been deactivated. Please contact support.', 403);
  }

  await cache.set(userCacheKey(userId), user, USER_CACHE_TTL);

  req.user = user;
  next();
});

export const bustUserCache = async (clerkId: string): Promise<void> => {
  await cache.del(userCacheKey(clerkId));
};

export const authorize = (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Role '${req.user?.role}' is not authorised to access this resource`,
          403,
        ),
      );
    }
    next();
  };
