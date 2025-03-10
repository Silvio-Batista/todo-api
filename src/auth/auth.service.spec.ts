import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('valid-jwt-token'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('Deve estar definido', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('Deve registrar um novo usuário', async () => {
    const authDto: AuthDto = { username: 'testuser', password: 'testpassword' };
    const newUser: User = {
      id: '1',
      username: 'testuser',
      password: 'hashedpassword',
    };

    jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null); // Usuário não existe
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
    jest.spyOn(usersService, 'createUser').mockResolvedValue(newUser);

    const result = await authService.register(authDto);

    expect(result).toEqual(expect.objectContaining({ username: 'testuser' }));
    expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
    expect(usersService.createUser).toHaveBeenCalledWith(
      'testuser',
      'hashedpassword',
    );
  });

  it('Deve falhar ao registrar um usuário já existente', async () => {
    const existingUser: User = {
      id: '1',
      username: 'testuser',
      password: 'hashedpassword',
    };

    jest.spyOn(usersService, 'findByUsername').mockResolvedValue(existingUser);

    await expect(
      authService.register({ username: 'testuser', password: 'testpassword' }),
    ).rejects.toThrow(ConflictException);

    expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
  });

  it('Deve fazer login e retornar um token', async () => {
    const existingUser: User = {
      id: '1',
      username: 'testuser',
      password: 'hashedpassword',
    };
    const authDto: AuthDto = { username: 'testuser', password: 'testpassword' };

    jest.spyOn(usersService, 'findByUsername').mockResolvedValue(existingUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(jwtService, 'sign').mockReturnValue('valid-jwt-token');

    const result = await authService.login(authDto);

    expect(result).toHaveProperty('access_token', 'valid-jwt-token');
    expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'testpassword',
      'hashedpassword',
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: 'testuser',
      sub: '1',
    });
  });

  it('Deve falhar no login com credenciais inválidas', async () => {
    jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

    await expect(
      authService.login({ username: 'testuser', password: 'wrongpassword' }),
    ).rejects.toThrow(UnauthorizedException);

    expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
  });
});
