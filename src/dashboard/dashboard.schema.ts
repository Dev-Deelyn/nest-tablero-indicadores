import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type DashboardDocument = Dashboard & Document;

@Schema()
export class Dashboard {
  @Prop({ required: true, unique: true })
  keyname: string;

  @Prop({ required: true })
  show: boolean;

  @Prop({ required: true })
  icon: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    default: [],
  })
  sections: mongoose.Types.ObjectId[];

}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
