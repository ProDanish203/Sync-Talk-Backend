import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { ChatsGateway } from './chats.gateway';
import { ChatsController } from './chat.controller';

@Module({
  controllers: [ChatsController],
  providers: [ChatsGateway, ChatsService, PrismaService],
})
export class ChatsModule {}
