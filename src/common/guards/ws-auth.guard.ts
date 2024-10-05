import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from '../services/prisma.service';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserPayload } from '../types/type';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.extractToken(client);

    if (!token) throw new WsException('Unauthorized Access');

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET as string,
      })) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          role: true,
          email: true,
          username: true,
        },
      });
      if (!user) throw new WsException('Unauthorized Access');

      const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

      if (roles && !roles.includes(user.role as Role))
        throw new ForbiddenException('Forbidden Access');

      (client as any).user = user as UserPayload;

      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new WsException('Authentication Error');
    }
  }

  private extractToken(client: Socket): string | undefined {
    const token =
      (client.handshake.query.token as string) ||
      client.handshake.headers.authorization?.split(' ')[1];

    return token;
  }
}
