import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RespondToFriendRequestDto } from './dto/friend-request.dto';
import { Request } from 'express';
import { PaginationParams } from 'src/common/types/type';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('requests')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  getFriendRequests(@Req() request: Request, @Query() query: PaginationParams) {
    return this.friendsService.getFriendRequests(query, request);
  }

  @Get('requests/sent')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  getSentFriendRequests(
    @Req() request: Request,
    @Query() query: PaginationParams,
  ) {
    return this.friendsService.getSentFriendRequests(query, request);
  }

  @Post('request/:id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  sendFriendRequest(
    @Req() request: Request,
    @Param('id') { id }: { id: string },
  ) {
    return this.friendsService.sendFriendRequest(id, request);
  }

  @Patch('request/:id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  respondToFriendRequest(
    @Req() request: Request,
    @Param('id') { id }: { id: string },
    @Body() respondToFriendRequestDto: RespondToFriendRequestDto,
  ) {
    return this.friendsService.respondToFriendRequest(
      id,
      respondToFriendRequestDto,
      request,
    );
  }

  @Delete('request/withdraw/:id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  withdrawFriendRequest(
    @Req() request: Request,
    @Param('id') { id }: { id: string },
  ) {
    return this.friendsService.withdrawFriendRequest(id, request);
  }

  @Delete('request/processed')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  removeProcessedFriendRequest() {
    return this.friendsService.deleteProcessedFriendRequests();
  }

  @Delete('request/:id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  removeFriend(@Req() request: Request, @Param('id') { id }: { id: string }) {
    return this.friendsService.removeFriend(id, request);
  }
}
