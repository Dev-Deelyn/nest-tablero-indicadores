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

  async createNewDashboard(keyname: string, show: boolean, icon?: string) {
    const newDashboard = new this.dashboardModel({ keyname, show, icon});
    return newDashboard.save();
  }

  async editDashboard(
    dashboardId: string,          // Identificador del dashboard
    newKeyname?: string,          // Nuevo nombre (opcional)
    show?: boolean,               // Nuevo estado de visibilidad (opcional)
    icon?: string                 // Nuevo icono (opcional)
  ) {
    try {
      // Se arma el objeto de actualización con los campos que se deseen modificar.
      const updateData: Partial<{ keyname: string; show: boolean; icon: string }> = {};
      
      if (newKeyname) {
        updateData.keyname = newKeyname;  // Actualiza el nombre
      }
      if (typeof show === 'boolean') {
        updateData.show = show;           // Actualiza el campo de visibilidad
      }
      if (icon !== undefined) {
        updateData.icon = icon;           // Actualiza el icono si se envía
      }
      
      // Si existen datos a actualizar, se realiza la operación filtrando por _id.
      if (Object.keys(updateData).length > 0) {
        const editedDashboard = await this.dashboardModel.findOneAndUpdate(
          { _id: dashboardId },  // Se utiliza el _id del dashboard para identificar el registro
          { $set: updateData },
          { new: true }          // Retorna el documento actualizado
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
  
}
