import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './dashboard.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  async createNewDashboard(@Body() body: any) {
    const { keyname, show, icon } = body;
    return this.dashboardService.createNewDashboard(keyname, show, icon);
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

  @Put('edit/:dashboardId')
  async editDashboard(
    @Param('dashboardId') dashboardId: string,
    @Body() body: any
  ) {
    const { newKeyname, show, icon } = body;
    if (!dashboardId) {
      throw new HttpException(
        'El id del dashboard es obligatorio.',
        HttpStatus.BAD_REQUEST
      );
    }
    // Llamada al método editDashboard ajustado en el servicio.
    return this.dashboardService.editDashboard(dashboardId, newKeyname, show, icon);
  }
}