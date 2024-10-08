import { Prisma, Role } from '@prisma/client';

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  filename: string;
}

type UserPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    username: true;
    role: true;
  };
}>;
