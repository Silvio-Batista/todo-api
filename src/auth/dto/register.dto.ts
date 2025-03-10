import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}
