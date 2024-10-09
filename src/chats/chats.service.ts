import { SendMessageDto } from './dto/message.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { minimalUserSelect } from 'src/common/queries/user';
import { PrismaService } from 'src/common/services/prisma.service';
import { PaginationInfo, QueryParams } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';
import { CreateGroupChatDto, UpdateGroupChatDto } from './dto/group.dto';

@Injectable()
export class ChatsService {
  private userSocketMap: { [userId: string]: string } = {};
  constructor(private readonly prisma: PrismaService) {}

  // Socket Services
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

  // Http Services
  async getAllChats(request: Request, query: QueryParams) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getChatMessages(id: string, request: Request) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createGroupChat(
    createGroupChatDto: CreateGroupChatDto,
    request: Request,
  ) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateGroupChat(
    id: string,
    updateGroupChatDto: UpdateGroupChatDto,
    request: Request,
  ) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteGroupChat(id: string, request: Request) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addParticipantsToGroup(
    id: string,
    participants: string[],
    request: Request,
  ) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeParticipantsFromGroup(
    id: string,
    participants: string[],
    request: Request,
  ) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
