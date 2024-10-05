import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket, Event } from 'socket.io';
import { ChatsService } from './chats.service';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { WsAuthGuard } from 'src/common/guards/ws-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { SendMessageDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsAuthGuard)
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('connection')
  handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.chatsService.addUserSocket(userId, client.id);
      this.server.emit('getOnlineUsers', this.chatsService.getOnlineUsers());
    }
  }

  @SubscribeMessage('connection')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = this.chatsService.removeUserSocket(client.id);
    if (userId) {
      this.server.emit('getOnlineUsers', this.chatsService.getOnlineUsers());
    }
  }

  @SubscribeMessage('sendMessage')
  @Roles(...Object.values(Role))
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) sendMessageDto: SendMessageDto,
  ) {
    return this.chatsService.sendMessage(sendMessageDto, client);
  }
}
