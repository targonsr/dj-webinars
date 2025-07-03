import type { User } from '../user'

export interface TeamMember extends User {
  // Additional team-specific properties can be added here
}

export interface InviteForm {
  email: string;
  role: string;
  permissions: string[];
}

export interface AvailablePermission {
  value: string;
  name: string;
}