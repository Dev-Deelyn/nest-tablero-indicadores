import { Controller, Get, Post, Body } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/creat-section.dto';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  // Endpoint para crear una sección
  @Post()
  async createSection(@Body() createSectionDto: CreateSectionDto) {
    const { keyname, dashboardId, show } = createSectionDto;
    return await this.sectionsService.createSection(keyname, dashboardId, show);
  }

  // Endpoint para traer todas las secciones
  @Get()
  async getAllSections() {
    return await this.sectionsService.getAllSections();
  }
}
