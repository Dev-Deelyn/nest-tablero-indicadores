import { Types } from "mongoose";
import { Dashboard } from "./dashboard.schema";

export interface UserDashboard {
  dashboard: Types.ObjectId | Dashboard; // Puede ser solo el ObjectId o el objeto completo (dependiendo de si lo poblas o no)
  visibilidad: boolean;
}