import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { MulterFile } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto, image: MulterFile) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(response: Response, { username, password }: LoginDto) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(request: Request, response: Response) {
    try {
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
