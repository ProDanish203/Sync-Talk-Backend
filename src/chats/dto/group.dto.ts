import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateGroupChatDto {
  @IsNotEmpty({ message: 'Group name is required' })
  @IsString({ message: 'Group name must be a string' })
  name: string;

  @IsString({ message: 'Reply to id must be a string' })
  @IsArray({ message: 'Participants must be an array' })
  participants: string[];

  @IsOptional()
  @IsString({ message: 'Group description must be a string' })
  description: string;
}

export class UpdateGroupChatDto extends PartialType(
  OmitType(CreateGroupChatDto, ['participants'] as const),
) {}
