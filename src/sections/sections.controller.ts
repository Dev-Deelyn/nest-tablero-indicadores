import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Delete, Put } from '@nestjs/common';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('add')
  async createSection(@Body() body: any) {
    const { keyname, name, show } = body;
    return await this.sectionsService.createSection(keyname, name, show);
  }

  @Get('get-all')
  async getAllSections() {
    return await this.sectionsService.getAllSections();
  }

  @Put('edit/:sectionId')
  async editSection(
    @Param('sectionId') sectionId: string,
    @Body() body: any
  ) {
    const { newKeyname, newName, show } = body;
    if (!sectionId) {
      throw new HttpException(
        'El id de la sección es obligatorio.',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.sectionsService.editSection(sectionId, newKeyname, newName, show);
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