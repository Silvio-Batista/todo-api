import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'meu_usuario',
    description: 'Nome de usuário para login',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'MinhaSenha123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
