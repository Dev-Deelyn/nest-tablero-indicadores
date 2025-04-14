import { Types } from "mongoose";
import { Sections } from "./sections.schema";

export interface SectionsDocument {
  section: Types.ObjectId | Sections; // Puede ser solo el ObjectId o el objeto completo (dependiendo de si lo poblas o no)
  dashboard: object;
  visibilidad: boolean;
}