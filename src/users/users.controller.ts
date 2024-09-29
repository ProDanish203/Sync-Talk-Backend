import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorators';
import { QueryParams } from 'src/common/types/type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  findAll(@Query() query: QueryParams) {
    return this.usersService.findAll(query);
  }
}
