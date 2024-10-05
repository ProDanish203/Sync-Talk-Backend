import { Socket } from 'socket.io';
import { User, Prisma } from '@prisma/client';
import { UserPayload } from './type';

type UserWithoutPassword = Omit<User, 'password'>;

declare module 'socket.io' {
  interface Socket {
    user?: UserPayload;
  }
}
