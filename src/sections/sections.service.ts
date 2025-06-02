import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Section, SectionDocument } from './sections.schema';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
  ) {}

  async createSection(
    keyname: string,
    show: boolean,
  ){

    try {
       const newSection = new this.sectionModel({
        keyname,
        show,
      });
      return await newSection.save();
    } catch (error) {
      console.error('Error al crear la sección: ', error);
      throw error;
    }
  }

  // Método para traer todas las secciones
  async getAllSections(): Promise<SectionDocument[]> {
    return await this.sectionModel.find().exec();
  }

  async editSection(
    sectionId: string,
    newkeyname?: string,
    show?: boolean
  ){
    try {
      const updateData: Partial<{ keyname: string; show: boolean;}> = {};

      if(newkeyname){
        updateData.keyname = newkeyname
      }

      if(typeof show === 'boolean'){
        updateData.show = show
      }

       if (Object.keys(updateData).length > 0) {
        const editedDashboard = await this.sectionModel.findOneAndUpdate(
          { _id: sectionId },
          { $set: updateData },
          { new: true }
        );
        return editedDashboard;
      } else {
        throw new Error('No hay campos para actualizar');
      }
    } catch (error) {
      
    }
  }

  async deleteSection(sectionId: string): Promise<SectionDocument> {
    return await this.sectionModel.findByIdAndDelete(sectionId);
  }

}
