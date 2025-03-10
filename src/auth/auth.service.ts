import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async register(
    authDto: AuthDto,
  ): Promise<{ user: User; access_token: string }> {
    const existingUser = await this.usersService.findByUsername(
      authDto.username,
    );
    if (existingUser) {
      throw new BadRequestException('Usuário já existe');
    }

    const user = await this.usersService.createUser(
      authDto.username,
      authDto.password,
    );

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { user, access_token: token };
  }

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto.username, authDto.password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
