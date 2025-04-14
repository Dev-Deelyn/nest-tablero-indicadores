import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { Sections, SectionSchema } from './sections.schema';
import { Dashboard, DashboardSchema } from 'src/dashboard/dashboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sections.name, schema: SectionSchema },
      { name: Dashboard.name, schema: DashboardSchema },
    ]),
  ],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
