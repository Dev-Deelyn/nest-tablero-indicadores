import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './dashboard.schema';
import { Section, SectionSchema } from 'src/sections/sections.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: Section.name, schema: SectionSchema }
    ]),
    DashboardModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
