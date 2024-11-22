import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dashboard, DashboardDocument } from './dashboard.schema';
import { Model } from 'mongoose';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name) private dashboardModel: Model<DashboardDocument>,
  ) { }

  async getAllDashboards(): Promise<Dashboard[]> {
    return this.dashboardModel.find().exec();
  }

  async createNewDashboard(keyname: string, show: boolean) {
    const newDashboard = new this.dashboardModel({ keyname, show });
    return newDashboard.save();
  }
}
