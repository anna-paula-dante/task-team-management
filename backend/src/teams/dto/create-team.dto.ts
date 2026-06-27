import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Nome do time',
    example: 'Time Verde',
    maxLength: 120,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  @MaxLength(120, { message: 'Nome deve ter no máximo 120 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Cor do time em formato hexadecimal',
    example: '#00FF66',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsNotEmpty({ message: 'Cor é obrigatória' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Cor deve ser um hexadecimal válido (ex: #00FF66)',
  })
  color: string;
}
