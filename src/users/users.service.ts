import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { minimalUserSelect, userSelect } from 'src/common/queries/user';
import { PrismaService } from 'src/common/services/prisma.service';
import { PaginationInfo, QueryParams } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: QueryParams) {
    const { page = 1, limit = 10, search = '', filter, sort } = query || {};
    try {
      const where: Prisma.UserWhereInput = {
        deletedAt: null,
      };
      const orderBy: Prisma.UserOrderByWithRelationInput = {};

      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (filter) orderBy.username = filter === 'atoz' ? 'asc' : 'desc';
      if (sort) orderBy[sort] = 'desc';

      const [users, totalCount] = await Promise.all([
        this.prisma.user.findMany({
          select: minimalUserSelect,
          where,
          orderBy,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const pagination: PaginationInfo = {
        totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      };

      return {
        data: users || [],
        pagination,
        message: 'Users found',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
          deletedAt: null,
        },
        select: userSelect,
      });

      return {
        data: user || {},
        message: 'User found',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
