import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { MulterFile } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';
import { Request, Response } from 'express';
import { StorageService } from 'src/common/services/fileUpload.service';
import { hashPassword, verifyPassword } from 'src/common/utils/hash';
import { userSelect } from 'src/common/queries/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    { email, username, fullname, password, role }: RegisterDto,
    image: MulterFile,
  ) {
    try {
      const userExists = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (userExists) {
        if (userExists.email === email)
          throw throwError('Email already taken', HttpStatus.BAD_REQUEST);
        if (userExists.username === username)
          throw throwError('Username already taken', HttpStatus.BAD_REQUEST);
      }

      // Create salt and hash password
      const { hash, salt } = hashPassword(password);

      // Upload image
      const uploaded_image = await this.storageService.uploadFile(image);
      // Create user

      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          fullname,
          role,
          avatar: uploaded_image.filename,
          password: hash,
          salt,
        },
      });

      if (!user)
        return throwError('Failed to register user', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(response: Response, { username, password }: LoginDto) {
    try {
      const userExists = await this.prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!userExists)
        throw throwError('Invalid Credentials', HttpStatus.NOT_FOUND);

      const isValidPassword = verifyPassword({
        password,
        salt: userExists.salt,
        hash: userExists.password,
      });

      if (!isValidPassword)
        throw throwError('Invalid Credentials', HttpStatus.NOT_FOUND);

      const user = await this.prisma.user.findFirst({
        where: {
          username,
        },
        select: userSelect,
      });

      const payload = { email: user.email, id: user.id, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      const cookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: 'none' as 'none',
        httpOnly: true,
        secure: true,
      };

      response.cookie('token', token, cookieOptions);
      return {
        message: 'User logged in successfully',
        data: user,
        token,
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(request: Request, response: Response) {
    try {
      if (!request.user)
        throw throwError('User not found', HttpStatus.NOT_FOUND);

      const cookieOptions = {
        sameSite: 'none' as 'none',
        httpOnly: true,
        secure: true,
      };

      response.clearCookie('token', cookieOptions);

      return {
        message: 'User logged out successfully',
        success: true,
        data: {},
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
