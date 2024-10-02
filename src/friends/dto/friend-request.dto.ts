import { RequestStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RespondToFriendRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Please specify the request status' })
  @IsEnum(RequestStatus, { message: 'Invalid request status' })
  status: RequestStatus;
}
