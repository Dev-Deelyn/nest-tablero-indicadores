import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { User, UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    const { username, profileType } = req.user as UserDocument;
    return { username, profileType };
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
  @Delete('dashboard/:dashboardId')
  async removeDashboardFromUser(
    @Request() request,
    @Param('dashboardId') dashboardId: string,
  ): Promise<User> {
    return this.userService.removeDashboardFromUser(request.user.sub, dashboardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('dashboard/:dashboardId')
  async addDashboardToUser(
    @Request() request,
    @Param('dashboardId') dashboardId: string,
  ): Promise<User> {
    return this.userService.addDashboardToUser(request.user.sub, dashboardId);
  }
}
