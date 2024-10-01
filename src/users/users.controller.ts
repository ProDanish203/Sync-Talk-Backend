import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorators';
import { QueryParams } from 'src/common/types/type';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  findAll(@Query() query: QueryParams) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  currentUser(@Req() req: Request) {
    return this.usersService.currentUser(req);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  findOne(@Param() { id }: { id: string }) {
    return this.usersService.findOne(id);
  }
}
