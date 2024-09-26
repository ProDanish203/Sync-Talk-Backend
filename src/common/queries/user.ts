import { Prisma } from '@prisma/client';

export const userSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  fullname: true,
  avatar: true,
  bio: true,
  country: true,
  phone: true,
  loginProvider: true,
  lastLoginAt: true,
  lastActiveAt: true,
  hasNotifications: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const minialUserSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  fullname: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;
