import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User, UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    const { username, profileType, access } = req.user as UserDocument;
    return { username, profileType, access };
  }

  @Post()
  async createNewUser(@Body() body: any) {
    const { username, password, email, profileType } = body;
    return this.userService.createNewUser(username, password, email, profileType);
  }

  @Delete()
  async deleteUser(@Body() body: any) {
    const { username, email } = body;
    try {
      return await this.userService.deleteUser(username, email);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al eliminar el usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new HttpException(
        `Error al obtener los usuarios: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('access/:userId')
  async updateAccess(
    @Param('userId') userId: string,
    @Body('access') access: { dashboard: string; sections: string[] }[],
  ) {
    try {
      return await this.userService.updateUserAccess(userId, access);
    } catch (err) {
      throw new HttpException(
        err.message || 'Error al actualizar access',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
