import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }, @Res() res: any) {
    const result = await this.authService.register(body.email, body.password, body.name);
    
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.json({ user: result.user });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: any) {
    const result = await this.authService.login(body.email, body.password);
    
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.json({ user: result.user });
  }
}