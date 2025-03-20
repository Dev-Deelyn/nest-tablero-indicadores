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

  async editDashboard(currentKeyname: string, newKeyname?: string, show?: boolean) {
    try {
      const updateData: Partial<{ keyname: string; show: boolean }> = {};
  
      // Verificar si hay un nuevo keyname para actualizar
      if (newKeyname) {
        updateData.keyname = newKeyname; // Este será el nuevo nombre
      }
  
      // Verificar si hay un cambio en el estado de show
      if (typeof show === 'boolean') {
        updateData.show = show;
      }
  
      // Actualizar el documento si hay datos que cambiar
      if (Object.keys(updateData).length > 0) {
        const editedDashboard = await this.dashboardModel.findOneAndUpdate(
          { keyname: currentKeyname }, // Usamos el nombre actual como filtro
          { $set: updateData },
          { new: true } // Retorna el documento actualizado
        );
  
        return editedDashboard; // Retornar el tablero editado
      } else {
        throw new Error('No hay campos para actualizar');
      }
    } catch (error) {
      console.error('Error al editar el dashboard:', error);
      throw error;
    }
  }
  
}
