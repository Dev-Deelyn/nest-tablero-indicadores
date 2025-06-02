import { Types } from "mongoose";
import { Dashboard } from "./dashboard.schema";

export interface UserDashboard {
  dashboard: Types.ObjectId | Dashboard;
  visibilidad: boolean;
}