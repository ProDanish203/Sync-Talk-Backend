import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'src/common/types/type';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  register(
    @UploadedFile() image: MulterFile,
    @Body(ValidationPipe) registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto, image);
  }

  @Post('login')
  login(
    @Res({ passthrough: true }) response: Response,
    @Body(ValidationPipe) loginDto: LoginDto,
  ) {
    return this.authService.login(response, loginDto);
  }

  @Post('logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(request, response);
  }
}
