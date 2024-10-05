import { User, Prisma } from '@prisma/client';
import { UserPayload } from './type';

type UserWithoutPassword = Omit<User, 'password'>;

declare global {
  namespace Express {
    interface User extends UserPayload {}
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}
