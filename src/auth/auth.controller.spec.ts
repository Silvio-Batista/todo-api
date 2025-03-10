import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest
              .fn()
              .mockResolvedValue({ id: uuidv4(), username: 'testuser' }),
            login: jest
              .fn()
              .mockResolvedValue({ access_token: 'valid-jwt-token' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('Deve estar definido', () => {
    expect(authController).toBeDefined();
  });

  it('Deve registrar um usuário', async () => {
    const authDto: AuthDto = { username: 'testuser', password: 'testpassword' };

    const result = await authController.register(authDto);

    expect(result).toEqual(expect.objectContaining({ username: 'testuser' }));
    expect(authService.register).toHaveBeenCalledWith(authDto);
  });

  it('Deve fazer login e retornar um token', async () => {
    const authDto: AuthDto = { username: 'testuser', password: 'testpassword' };

    const result = await authController.login(authDto);

    expect(result).toEqual({ access_token: 'valid-jwt-token' });
    expect(authService.login).toHaveBeenCalledWith(authDto);
  });
});
