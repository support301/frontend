
export enum UserRole {
  TALENT_ACQUISITION = 'Talent Acquisition Team',
  ACADEMIC_COUNSELLING = 'Academic Counselling Team',
  TEAM_LEAD = 'Team Lead',
  MANAGER = 'Manager',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super Admin'
}

export enum TrainerStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
  HOLD = 'Hold',
  BLACKLISTED = 'Blacklisted',
  PENDING_APPROVAL = 'Pending Approval' // New status
}

export interface Permission {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canDownload: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  permissions: Permission;
}

export interface Trainer {
  id: string;
  tutorId: string;
  name: string;
  email: string;
  languages: string[];
  qualification: string;
  currentOccupation: string;
  teachingExperience: string;
  specialities: string;
  workExperience: string;
  majorStrengths: string;
  subjects: string;
  shortIntroduction: string;
  phoneNumber: string;
  status: TrainerStatus;
  createdAt: string;
  createdBy: string;
  priceMin: number;
  priceMax: number;
  currency: string;
}

export const RolePermissions: Record<UserRole, Permission> = {
  [UserRole.TALENT_ACQUISITION]: { canView: true, canEdit: true, canDelete: false, canDownload: true, canManageUsers: false, canViewAnalytics: false },
  [UserRole.ACADEMIC_COUNSELLING]: { canView: true, canEdit: false, canDelete: false, canDownload: true, canManageUsers: false, canViewAnalytics: false },
  [UserRole.TEAM_LEAD]: { canView: true, canEdit: true, canDelete: false, canDownload: true, canManageUsers: false, canViewAnalytics: true },
  [UserRole.MANAGER]: { canView: true, canEdit: true, canDelete: false, canDownload: true, canManageUsers: false, canViewAnalytics: true },
  [UserRole.ADMIN]: { canView: true, canEdit: true, canDelete: true, canDownload: true, canManageUsers: false, canViewAnalytics: true },
  [UserRole.SUPER_ADMIN]: { canView: true, canEdit: true, canDelete: true, canDownload: true, canManageUsers: true, canViewAnalytics: true },
};
