import { CreateGroupChatDto, UpdateGroupChatDto } from './dto/group.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorators';
import { QueryParams } from 'src/common/types/type';
import { Request } from 'express';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  getAllChats(@Req() request: Request, @Query() query: QueryParams) {
    return this.chatsService.getAllChats(request, query);
  }

  @Get(':id/messages')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  getChatMessages(@Req() request: Request, @Param('id') id: string) {
    return this.chatsService.getChatMessages(id, request);
  }

  @Post('group')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  createGroupChat(
    @Body(ValidationPipe) createGroupChatDto: CreateGroupChatDto,
    @Req() request: Request,
  ) {
    return this.chatsService.createGroupChat(createGroupChatDto, request);
  }

  @Patch('group/:id/add-participant')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  addParticipantToGroup(
    @Param('id') id: string,
    @Body(ValidationPipe) participants: string[],
    @Req() request: Request,
  ) {
    return this.chatsService.addParticipantsToGroup(id, participants, request);
  }

  @Patch('group/:id/remove-participant')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  removeParticipantsFromGroup(
    @Param('id') id: string,
    @Body(ValidationPipe) participants: string[],
    @Req() request: Request,
  ) {
    return this.chatsService.removeParticipantsFromGroup(
      id,
      participants,
      request,
    );
  }

  @Patch('group/:id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  updateGroupChat(
    @Param('id') id: string,
    @Body(ValidationPipe) updateGroupChatDto: UpdateGroupChatDto,
    @Req() request: Request,
  ) {
    return this.chatsService.updateGroupChat(id, updateGroupChatDto, request);
  }

  @Delete('group/:id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  deleteGroupChat(@Param('id') id: string, @Req() request: Request) {
    return this.chatsService.deleteGroupChat(id, request);
  }
}
