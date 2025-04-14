import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SectionsDocument = Sections & Document;

@Schema({ _id: false }) // Indicamos _id: false para que no genere un id adicional en el objeto embebido.
export class EmbeddedDashboard {
  @Prop({ required: true })
  _id: Types.ObjectId; // Guarda el id del dashboard.

  @Prop({ required: true })
  keyname: string; // El keyname del dashboard.

  @Prop({ required: true })
  icon: string; // El icon del dashboard.
}

export const EmbeddedDashboardSchema = SchemaFactory.createForClass(EmbeddedDashboard);

@Schema()
export class Sections {
  @Prop({ required: true, unique: true })
  keyname: string;

  @Prop({ required: true, type: EmbeddedDashboardSchema })
  dashboard: EmbeddedDashboard;

  @Prop({ required: true })
  show: boolean;
}

export const SectionSchema = SchemaFactory.createForClass(Sections);
