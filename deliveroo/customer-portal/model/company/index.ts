import type { Address, ContactInfo } from '../common'

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  vatNumber: string;
  address: Address;
  contactInfo: ContactInfo;
  billingAddress: Address;
  creditLimit?: number;
  creditUsed: number;
  industryType: string;
  employees: any[]; // Reference to User[]
  paymentTerms: string;
  isActive: boolean;
  createdAt: Date;
}