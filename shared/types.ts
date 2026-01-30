
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  UNIT_HOLDER = 'UNIT_HOLDER'
}

export enum LeaseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED'
}

export enum RentStatus {
  PAID = 'PAID',
  DUE = 'DUE',
  OVERDUE = 'OVERDUE'
}

export interface EstateDTO {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
}

export interface UnitDTO {
  id: string;
  estateId: string;
  unitName: string;
  proprietorName: string;
  activityType: string;
  employeeCount: number;
  leaseStatus: LeaseStatus;
}

export interface LeaseDTO {
  id: string;
  unitId: string;
  startDate: string;
  endDate: string;
  agreementNumber: string;
  status: LeaseStatus;
}

export interface RentRecordDTO {
  id: string;
  unitId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: RentStatus;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  linkedUnitId?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: string;
  userId: string;
  userName: string;
  description: string;
  metadata?: any;
}

export interface AppState {
  estates: EstateDTO[];
  units: UnitDTO[];
  leases: LeaseDTO[];
  rentRecords: RentRecordDTO[];
  users: UserDTO[];
  currentUser: UserDTO | null;
  auditLogs: AuditEvent[];
}
