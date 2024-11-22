import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { Dashboard } from 'src/dashboard/dashboard.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Dashboard.name) private readonly dashboardModel: Model<Dashboard>,
  ) { }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async createNewUser(username: string, password: string, email: string, profileType: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new this.userModel({ username, password: hashedPassword, email, profileType });
    return newUser.save();
  }

  async addDashboardToUser(userId: string, dashboardId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { dashboards: dashboardId } },
      { new: true }
    ).populate('dashboards');
  }

  async removeDashboardFromUser(userId: string, dashboardId: string): Promise<User> {
    const dashboardExists = await this.dashboardModel.exists({ _id: dashboardId });
    if (!dashboardExists) {
      throw new Error('El tablero no existe.');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { dashboards: new Types.ObjectId(dashboardId) } },
      { new: true },
    ).populate('dashboards');

    if (!updatedUser) {
      throw new Error('Usuario no encontrado.');
    }

    return updatedUser;
  }

  async getUserDashboards(userId: string): Promise<Dashboard[]> {
    const user = await this.userModel.findById(userId).populate<{ dashboards: Dashboard[] }>('dashboards');
    return user?.dashboards || [];
  }
}
