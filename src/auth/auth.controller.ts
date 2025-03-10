import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from 'src/users/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(
    @Body() authDto: AuthDto,
  ): Promise<{ user: User; access_token: string }> {
    return this.authService.register(authDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
