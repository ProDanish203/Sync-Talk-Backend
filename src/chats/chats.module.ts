import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { ChatsGateway } from './chats.gateway';

@Module({
  providers: [ChatsGateway, ChatsService, PrismaService],
})
export class ChatsModule {}
