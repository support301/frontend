export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

export enum AdminType {
  OWNER = "owner",
  BDE = "BDE",
  SALESMANAGER = "sales manager",
  TRAINING_MANAGER = "training manager",
  TUTOR_ACQUISITION = "tutor Acquisition",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  HOLD = "HOLD",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  is_verified: boolean;
  status: UserStatus;
  roles: UserRole[];
  adminType?: AdminType;
  createdAt: string;
  updatedAt: string;
}
