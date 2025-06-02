import { Types } from "mongoose";
import { Section } from "./sections.schema";

export interface SectionsDocument {
  section: Types.ObjectId | Section; // Puede ser solo el ObjectId o el objeto completo (dependiendo de si lo poblas o no)
  visibilidad: boolean;
}