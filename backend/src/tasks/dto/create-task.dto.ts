import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from '../../../generated/prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Criar tela de times',
  })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Implementar listagem de times seguindo o mockup aprovado',
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    example: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status inválido' })
  status?: TaskStatus;

  @ApiProperty({
    description: 'Lista de IDs dos times associados à tarefa (mínimo 1)',
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Pelo menos um time deve ser informado' })
  @IsUUID('all', { each: true, message: 'Cada teamId deve ser um UUID válido' })
  teamIds: string[];
}
