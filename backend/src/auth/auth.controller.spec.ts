import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and set cookie', async () => {
      const body = { email: 'test@example.com', password: 'pass', name: 'Test' };
      const result = { access_token: 'token', user: { id: '1', email: 'test@example.com', name: 'Test' } };
      const mockRes = {
        cookie: jest.fn(),
        json: jest.fn(),
      };

      mockAuthService.register.mockResolvedValue(result);

      await controller.register(body, mockRes);

      expect(mockAuthService.register).toHaveBeenCalledWith(body.email, body.password, body.name);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        result.access_token,
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'strict',
          maxAge: expect.any(Number),
        })
      );
      expect(mockRes.json).toHaveBeenCalledWith({ user: result.user });
    });
  });

  describe('login', () => {
    it('should call authService.login and set cookie', async () => {
      const body = { email: 'test@example.com', password: 'pass' };
      const result = { access_token: 'token', user: { id: '1', email: 'test@example.com', name: 'Test' } };
      const mockRes = {
        cookie: jest.fn(),
        json: jest.fn(),
      };

      mockAuthService.login.mockResolvedValue(result);

      await controller.login(body, mockRes);

      expect(mockAuthService.login).toHaveBeenCalledWith(body.email, body.password);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        result.access_token,
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'strict',
          maxAge: expect.any(Number),
        })
      );
      expect(mockRes.json).toHaveBeenCalledWith({ user: result.user });
    });
  });
});