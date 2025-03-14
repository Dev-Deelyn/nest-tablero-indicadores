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

  @UseGuards(JwtAuthGuard)
  @Delete('dashboard/:dashboardId')
  async removeDashboardFromUser(
    @Request() request,
    @Param('dashboardId') dashboardId: string,
  ): Promise<User> {
    return this.userService.removeDashboardFromUser(request.user, dashboardId);
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
