import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/creat-section.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  // Endpoint para crear una sección
  @Post('add')
  async createSection(@Body() createSectionDto: CreateSectionDto) {
    const { keyname, show } = createSectionDto;
    return await this.sectionsService.createSection(keyname, show);
  }

  // Endpoint para traer todas las secciones
  @Get('get-all')
  async getAllSections() {
    return await this.sectionsService.getAllSections();
  }

  @Post('edit/:sectionId')
  async editSection(
    @Param('sectionId') sectionId: string,
    @Body() body: any
  ){
    const { newKeyname, show } = body
    if (!sectionId) {
      throw new HttpException(
        'El id del dashboard es obligatorio.',
        HttpStatus.BAD_REQUEST
      );
    }
    // Llamada al método editDashboard ajustado en el servicio.
    return this.sectionsService.editSection(sectionId, newKeyname, show);
  }

  @Delete('delete/:sectionId')
  async deleteSection(@Param('sectionId') sectionId: string) {
    try {
      return await this.sectionsService.deleteSection(sectionId);
    } catch (error) {
      throw new HttpException('Error eliminando la sección', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
