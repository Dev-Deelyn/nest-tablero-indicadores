import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dashboard, DashboardDocument } from './dashboard.schema';
import mongoose, { Model } from 'mongoose';
import { Section, SectionDocument } from 'src/sections/sections.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name) private dashboardModel: Model<DashboardDocument>,
    @InjectModel(Section.name) private sectionsModel: Model<SectionDocument>,
  ) {}

  async getAllDashboards() {
    try {
      const dashboard = await this.dashboardModel
        .find()
        .populate('sections', 'keyname show')
        .exec();

      return dashboard;
    } catch (error) {
      console.error('Error al obtener el dashboard:', error);
      throw error;
    }
  }

  async createNewDashboard(keyname: string, show: boolean, icon?: string) {
    const newDashboard = new this.dashboardModel({ keyname, show, icon });
    return newDashboard.save();
  }

  async editDashboard(
    dashboardId: string,
    newKeyname?: string,
    show?: boolean,
    icon?: string,
  ) {
    try {
      const updateData: Partial<{ keyname: string; show: boolean; icon: string }> = {};

      if (newKeyname) {
        updateData.keyname = newKeyname;
      }
      if (typeof show === 'boolean') {
        updateData.show = show;
      }
      if (icon !== undefined) {
        updateData.icon = icon;
      }

      if (Object.keys(updateData).length > 0) {
        const editedDashboard = await this.dashboardModel.findOneAndUpdate(
          { _id: dashboardId },
          { $set: updateData },
          { new: true }
        );
        return editedDashboard;
      } else {
        throw new Error('No hay campos para actualizar');
      }
    } catch (error) {
      console.error('Error al editar el dashboard:', error);
      throw error;
    }
  }

  async updateDashboardSections(dashboardId: string, sections: string[]) {
    try {

      const objectIds = sections.map(id => new mongoose.Types.ObjectId(id));

      const updatedDashboard = await this.dashboardModel.findByIdAndUpdate(
        dashboardId,
        { $set: { sections: objectIds } },
        { new: true }
      );

      return this.dashboardModel
        .findById(updatedDashboard._id)
        .populate('sections', 'keyname show');
    } catch (error) {
      console.error('Error al actualizar las secciones: ', error);
      throw error;
    }
  }

}
