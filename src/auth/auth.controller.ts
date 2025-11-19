import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  // Genera tanto el refresh como el access token, y envía el refresh a la cookie
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user: UserDocument = await this.authService.validateUser(
      req.body.username,
      req.body.password
    );

    const { access_token, refresh_token } = await this.authService.login(user);

    // Guardar refresh token en cookie HttpOnly
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,        // no accesible por JS
      secure: false,         // en local puede ser false, en prod true
      sameSite: 'strict',    // evita CSRF básico
      path: '/auth/refresh', // solo se envía a este endpoint
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    });

    return { access_token };
  }

  // Lee el refresh desde la cookie y devuelve un nuevo access
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const rt = req.cookies['refresh_token'];
    if (!rt) throw new UnauthorizedException('No hay refresh token');

    try {
      const decoded = this.jwtService.verify(rt, { secret: 'S3CR370' });
      return this.authService.refreshTokens(decoded.sub, rt);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  // Borra refresh en la BD y limpia la cookie
  @Post('logout')
  async logout(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { userId } = body;
    await this.authService.logout(userId);

    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Sesión cerrada' };
  }

  @Post('register')
  async register(@Body() body: any) {
    const { username, password, email, profileType } = body;
    return this.authService.register(username, password, email, profileType);
  }
}
