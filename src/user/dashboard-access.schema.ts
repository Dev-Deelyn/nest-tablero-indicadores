// dashboard-access.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class DashboardAccess {
  @Prop({ type: Types.ObjectId, ref: 'Dashboard', required: true })
  dashboard: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Section' }], default: [] })
  sections: Types.ObjectId[];
}

export const DashboardAccessSchema = SchemaFactory.createForClass(DashboardAccess);
