import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { Section, SectionSchema } from './sections.schema';
import { Dashboard, DashboardSchema } from 'src/dashboard/dashboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Section.name, schema: SectionSchema },
    ]),
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
