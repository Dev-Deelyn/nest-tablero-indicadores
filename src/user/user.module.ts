import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { Dashboard, DashboardSchema } from 'src/dashboard/dashboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
    UserModule,
    DashboardModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
