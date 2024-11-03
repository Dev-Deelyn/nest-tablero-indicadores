import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
