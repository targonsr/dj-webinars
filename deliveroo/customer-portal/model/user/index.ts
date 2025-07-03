export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  companyId: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  VIEWER = 'VIEWER'
}

export enum Permission {
  CREATE_REQUEST = 'CREATE_REQUEST',
  VIEW_REQUEST = 'VIEW_REQUEST',
  EDIT_REQUEST = 'EDIT_REQUEST',
  DELETE_REQUEST = 'DELETE_REQUEST',
  MANAGE_TEAM = 'MANAGE_TEAM',
  VIEW_BILLING = 'VIEW_BILLING',
  MANAGE_BILLING = 'MANAGE_BILLING'
}