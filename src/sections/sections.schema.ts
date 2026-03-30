import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema()
export class Section {
  @Prop({ required: true, unique: true })
  keyname: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  show: boolean;

  @Prop({ default: false })
  linked: boolean;
}

export const SectionSchema = SchemaFactory.createForClass(Section);