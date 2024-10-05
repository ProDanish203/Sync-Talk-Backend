import { SendMessageDto } from './dto/message.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Socket } from 'socket.io';
import { minimalUserSelect } from 'src/common/queries/user';
import { PrismaService } from 'src/common/services/prisma.service';
import { PaginationInfo, QueryParams } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';

@Injectable()
export class ChatsService {
  private userSocketMap: { [userId: string]: string } = {};
  constructor(private readonly prisma: PrismaService) {}

  addUserSocket(userId: string, socketId: string) {
    this.userSocketMap[userId] = socketId;
  }

  removeUserSocket(socketId: string) {
    const userId = Object.keys(this.userSocketMap).find(
      (key) => this.userSocketMap[key] === socketId,
    );
    if (userId) {
      delete this.userSocketMap[userId];
    }
    return userId;
  }

  getOnlineUsers() {
    return Object.keys(this.userSocketMap);
  }

  async sendMessage(sendMessageDto: SendMessageDto, client: Socket) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
