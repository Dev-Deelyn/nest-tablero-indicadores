import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async deleteUser(username: string, email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOneAndDelete({ username, email });
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }
    return { message: 'Usuario eliminado correctamente.' };
  }

  async addDashboardToUser(userId: string, dashboardId: string): Promise<User> {
    // Busca el dashboard primero
    const dashboard = await this.dashboardModel.findById(dashboardId); // Asegúrate de que tienes el modelo de Dashboard disponible
    if (!dashboard) {
      throw new HttpException('Dashboard no encontrado', HttpStatus.NOT_FOUND);
    }
  
    // Extrae la propiedad `keyname`
    const dashboardKeyname = dashboard.keyname;
  
    // Actualiza el usuario con el `keyname` del dashboard
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { dashboards: dashboardKeyname } }, // Guarda `keyname` en lugar del ID
      { new: true }
    ).populate('dashboards'); // Popula si `dashboards` sigue siendo una referencia
  
    if (!updatedUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
  
    return updatedUser;
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
