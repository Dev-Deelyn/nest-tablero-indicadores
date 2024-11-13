import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }

  @Post()
  async createNewUser(@Body() body: any) {
    const { username, password, email, profileType } = body;
    return this.userService.createNewUser(username, password, email, profileType);
  }

  @Get('get-all')
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userService.getAllUsers();
      return users;
    } catch (error) {
      throw new HttpException(
        'Error al obtener los usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
