import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return access_token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const name = 'Test User';
      const user = { id: 'user-1', email, password: 'hashed', name };
      const token = 'jwt-token';

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.register(email, password, name);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      // UsersService.create получает обычный пароль (хеширование внутри UsersService)
      expect(mockUsersService.create).toHaveBeenCalledWith(email, password, name);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user.id, email });
      expect(result).toEqual({
        access_token: token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ email: 'test@example.com' });

      await expect(service.register('test@example.com', 'pass', 'Name')).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access_token and user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 'user-1', email, password: 'hashed', name: 'Test' };
      const token = 'jwt-token';

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(email, password);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: user.id, email });
      expect(result).toEqual({
        access_token: token,
        user: { id: user.id, email: user.email, name: user.name },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login('test@example.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = { id: 'user-1', email: 'test@example.com', password: 'hashed', name: 'Test' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@example.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });
});