import type { User } from '../user'
import type { AvailablePermission } from './index'

export const mockTeamMembers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+48123456789',
    role: 'COMPANY_ADMIN' as any,
    companyId: '1',
    permissions: ['CREATE_REQUEST', 'VIEW_REQUEST', 'EDIT_REQUEST', 'MANAGE_TEAM', 'VIEW_BILLING', 'MANAGE_BILLING'] as any,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'employee@company.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+48987654321',
    role: 'EMPLOYEE' as any,
    companyId: '1',
    permissions: ['CREATE_REQUEST', 'VIEW_REQUEST', 'EDIT_REQUEST'] as any,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    email: 'viewer@company.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '+48555666777',
    role: 'VIEWER' as any,
    companyId: '1',
    permissions: ['VIEW_REQUEST'] as any,
    isActive: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  }
]

export const mockAvailablePermissions: AvailablePermission[] = [
  { value: 'CREATE_REQUEST', name: 'Create Requests' },
  { value: 'VIEW_REQUEST', name: 'View Requests' },
  { value: 'EDIT_REQUEST', name: 'Edit Requests' },
  { value: 'VIEW_BILLING', name: 'View Billing' }
]