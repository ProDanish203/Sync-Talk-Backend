import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/common/services/prisma.service';
import { throwError } from 'src/common/utils/helpers';
import { RespondToFriendRequestDto } from './dto/friend-request.dto';
import { PaginationInfo, PaginationParams } from 'src/common/types/type';
import { Prisma } from '@prisma/client';
import { minimalUserSelect } from 'src/common/queries/user';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFriendRequests(query: PaginationParams, req: Request) {
    const { page = 1, limit = 30 } = query;
    const skip = (page - 1) * limit;
    try {
      const where = {
        toId: req.user.id,
        status: 'PENDING',
      } as Prisma.FriendRequestWhereInput;
      const [friendRequests, totalCount] = await Promise.all([
        this.prisma.friendRequest.findMany({
          where,
          skip: skip,
          take: limit,
        }),
        this.prisma.friendRequest.count({
          where,
        }),
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
        data: friendRequests,
        pagination,
        message: 'Friend requests retrieved',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getSentFriendRequests(query: PaginationParams, req: Request) {
    const { page = 1, limit = 30 } = query;
    const skip = (page - 1) * limit;
    try {
      const where = {
        fromId: req.user.id,
        status: 'PENDING',
      } as Prisma.FriendRequestWhereInput;
      const [friendRequests, totalCount] = await Promise.all([
        this.prisma.friendRequest.findMany({
          where,
          skip: skip,
          take: limit,
        }),
        this.prisma.friendRequest.count({
          where,
        }),
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
        data: friendRequests,
        pagination,
        message: 'Friend requests retrieved',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendFriendRequest(id: string, req: Request) {
    try {
      if (req.user.id === id)
        throw throwError(
          'You cannot send a friend request to yourself',
          HttpStatus.BAD_REQUEST,
        );

      const user = await this.prisma.user.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });

      if (!user) throw throwError('User not found', HttpStatus.NOT_FOUND);

      const friendRequest = await this.prisma.friendRequest.create({
        data: {
          fromId: req.user.id,
          toId: id,
          status: 'PENDING',
        },
      });

      if (!friendRequest)
        throw throwError('Friend request not sent', HttpStatus.BAD_REQUEST);

      return {
        data: friendRequest,
        message: 'Friend request sent',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async respondToFriendRequest(
    id: string,
    { status }: RespondToFriendRequestDto,
    req: Request,
  ) {
    try {
      const request = await this.prisma.friendRequest.findUnique({
        where: {
          id,
          toId: req.user.id,
        },
      });

      if (!request)
        throw throwError('Friend request not found', HttpStatus.NOT_FOUND);

      const updateRequest = await this.prisma.friendRequest.update({
        where: {
          id: request.id,
        },
        data: {
          status,
        },
      });

      if (!updateRequest)
        throw throwError(
          'Failed to repond to the friend request',
          HttpStatus.BAD_REQUEST,
        );

      if (status === 'ACCEPTED') {
        await this.prisma.friend.create({
          data: {
            user: {
              connect: { id: request.fromId },
            },
            friend: {
              connect: { id: request.toId },
            },
          },
        });

        await this.prisma.friend.create({
          data: {
            user: {
              connect: { id: request.toId },
            },
            friend: {
              connect: { id: request.fromId },
            },
          },
        });
      }

      return {
        data: updateRequest,
        message: 'Friend request responded to',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async withdrawFriendRequest(id: string, req: Request) {
    try {
      const deletedRequest = await this.prisma.friendRequest.delete({
        where: {
          id,
          fromId: req.user.id,
        },
      });

      return {
        data: deletedRequest,
        message: 'Friend request withdrawn',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeFriend(id: string, req: Request) {
    try {
      const deletedFriend = await this.prisma.friend.delete({
        where: {
          userId_friendId: {
            userId: req.user.id,
            friendId: id,
          },
        },
      });

      return {
        data: deletedFriend,
        message: 'Friend removed',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteProcessedFriendRequests() {
    try {
      const deletedRequests = await this.prisma.friendRequest.deleteMany({
        where: {
          OR: [{ status: 'ACCEPTED' }, { status: 'REJECTED' }],
        },
      });

      return {
        data: deletedRequests,
        message: 'Processed friend requests (accepted and rejected) deleted',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllFriends(query: PaginationParams, req: Request) {
    const { page = 1, limit = 30 } = query;
    const skip = (page - 1) * limit;
    try {
      const where = {
        OR: [{ userId: req.user.id }, { friendId: req.user.id }],
      } as Prisma.FriendWhereInput;

      const [friendRequests, totalCount] = await Promise.all([
        this.prisma.friend.findMany({
          where,
          skip: skip,
          take: limit,
          include: {
            user: {
              select: minimalUserSelect,
            },
            friend: {
              select: minimalUserSelect,
            },
          },
        }),
        this.prisma.friend.count({
          where,
        }),
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
        data: friendRequests,
        pagination,
        message: 'Friend requests retrieved',
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
