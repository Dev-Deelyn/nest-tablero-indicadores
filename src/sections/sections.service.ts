import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sections, SectionsDocument } from './sections.schema';
import { Dashboard, DashboardDocument } from 'src/dashboard/dashboard.schema';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Sections.name) private sectionModel: Model<SectionsDocument>,
    @InjectModel(Dashboard.name) private readonly dashboardModel: Model<DashboardDocument>,
  ) {}

  // Método para crear una sección, almacenando el dashboard embebido
  async createSection(
    keyname: string,
    dashboardId: string,
    show: boolean,
  ): Promise<SectionsDocument> {
    // Busca el dashboard por su id
    const dashboard = await this.dashboardModel.findById(dashboardId);
    if (!dashboard) {
      throw new NotFoundException(`Dashboard con id ${dashboardId} no encontrado`);
    }

    // Construimos el objeto embebido con los campos deseados:
    const embeddedDashboard = {
      _id: dashboard._id,
      keyname: dashboard.keyname,
      icon: dashboard.icon,
    };

    // Creamos la nueva sección, asignando el objeto embebido
    const newSection = new this.sectionModel({
      keyname,
      dashboard: embeddedDashboard,
      show,
    });
    return await newSection.save();
  }

  // Método para traer todas las secciones
  async getAllSections(): Promise<SectionsDocument[]> {
    return await this.sectionModel.find().exec();
  }
}
