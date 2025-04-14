import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DashboardDocument = Dashboard & Document;

@Schema()
export class Dashboard {
  @Prop({ required: true, unique: true })
  keyname: string;

  @Prop({ required: true })
  show: boolean;

  @Prop({ required: true })
  icon: string;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);