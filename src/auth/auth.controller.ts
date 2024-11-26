import { Body, Controller, Post, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from '../user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Request() req) {
    const user: UserDocument = await this.authService.validateUser(req.body.username, req.body.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    const { username, password, email, profileType } = body;
    return this.authService.register(username, password, email, profileType);
  }

}
