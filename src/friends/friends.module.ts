import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService],
})
export class FriendsModule {}
