import { Body, Controller, Get, HttpException, HttpStatus, Post, Put} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './dashboard.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Post()
  async createNewDashboard(@Body() body: any) {
    const { keyname, show } = body;
    return this.dashboardService.createNewDashboard(keyname, show);
  }

  @Get('get-all')
  async getAllUsers(): Promise<Dashboard[]> {
    try {
      const users = await this.dashboardService.getAllDashboards();
      return users;
    } catch (error) {
      throw new HttpException(
        'Error al obtener los tableros',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('edit')
  async editDashboard(@Body() body: any) {
    const { currentKeyname, newKeyname, show } = body;
    if (!currentKeyname) {
      throw new HttpException(
        'El nombre actual del tablero (currentKeyname) es obligatorio.',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.dashboardService.editDashboard(currentKeyname, newKeyname, show);
  }

}
