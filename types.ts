export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  UNIT_HOLDER = 'UNIT_HOLDER'
}

export interface Estate {
  id: string;
  name: string;
  location: string;
  totalArea: number; // in sq ft
  establishedDate: string;
}

export interface UnitHistory {
  id: string;
  date: string;
  type: 'NAME_CHANGE' | 'CONSTITUTION_CHANGE' | 'LEASE_RENEWAL' | 'OTHER';
  description: string;
}

export interface RentPayment {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'PARTIAL';
  receiptNumber?: string;
  period: string; // e.g., "May 2024"
}

export type RequestType = 
  | 'NEW_UNIT' 
  | 'ESTATE_EDIT' 
  | 'UNIT_EDIT' // General edits
  | 'LEASE_RENEWAL' 
  | 'NAME_CHANGE' 
  | 'PROPRIETOR_CHANGE'
  | 'CONSTITUTION_CHANGE'
  | 'ACTIVITY_CHANGE'
  | 'CONTACT_CHANGE' // Phone/Email
  | 'EMPLOYEE_CHANGE'
  | 'OTHER';

export type RequestStatus = 'PENDING' | 'SUBMITTED_TO_MANAGER' | 'FORWARDED_TO_ADMIN' | 'APPROVED' | 'REJECTED';

export interface ServiceRequest {
  id: string;
  targetId: string; 
  targetName: string; // Helper for UI display
  estateId?: string; // context for sorting
  type: RequestType;
  status: RequestStatus;
  description: string;
  requestDate: string;
  comments?: string; // Rejection reasons etc.
  requesterRole: UserRole;
  payload?: any; 
  
  // New fields for workflow
  documentName?: string; // Mock for uploaded file evidence
  managerRemarks?: string; // Remarks added by manager when forwarding
}

export interface Unit {
  id: string;
  estateId: string;
  name: string;
  proprietorName: string;
  lineOfActivity: string;
  employeeCount: number;
  contactEmail: string;
  contactPhone: string;
  constitution?: string; // E.g. Proprietorship, Partnership
  
  // Agreements
  leaseDeedDate: string;
  leaseDurationYears: number;
  rentAgreementDate: string;
  monthlyRent: number;
  rentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  lastRentPaymentDate: string;
  
  history: UnitHistory[];
  rentHistory?: RentPayment[];
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  assignedUnitId?: string;
  assignedEstateIds?: string[];
}

export type ViewState = 'DASHBOARD' | 'ESTATES' | 'UNITS' | 'UNIT_DETAIL' | 'AI_ASSISTANT' | 'REQUESTS' | 'USER_MANAGEMENT';