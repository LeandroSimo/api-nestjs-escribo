import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './shared/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/shared/user.model';
import { JwtAuthGuard } from './shared/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/signin')
  @UseGuards(JwtAuthGuard)
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<any> {
    try {
      const result = await this.authService.signIn(email, password);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Falha na autenticação',
      };
    }
  }

  @Post('/signup')
  async signup(@Body() user: User): Promise<any> {
    try {
      const result = await this.authService.signup(user);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to signup',
      };
    }
  }
}
