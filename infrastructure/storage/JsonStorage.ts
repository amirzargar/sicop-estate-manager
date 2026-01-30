
import { AppState, UserRole, LeaseStatus, RentStatus } from '../../shared/types';

const STORAGE_KEY = 'sicop_estate_manager_v3';

const seedData: AppState = {
  estates: [
    { id: 'e1', name: 'BAMK Estate', location: 'Industrial Area A', totalUnits: 50 },
    { id: 'e2', name: 'HMT Estate', location: 'Udyog Nagar', totalUnits: 30 },
    { id: 'e3', name: 'Sanat Nagar Estate', location: 'Downtown Hub', totalUnits: 40 },
  ],
  units: [
    { id: 'u1', estateId: 'e1', unitName: 'Alpha Tech', proprietorName: 'John Doe', activityType: 'Manufacturing', employeeCount: 25, leaseStatus: LeaseStatus.ACTIVE },
    { id: 'u2', estateId: 'e1', unitName: 'Beta Plastics', proprietorName: 'Jane Smith', activityType: 'Chemicals', employeeCount: 12, leaseStatus: LeaseStatus.ACTIVE },
    { id: 'u3', estateId: 'e2', unitName: 'Gamma Gears', proprietorName: 'Robert Brown', activityType: 'Engineering', employeeCount: 45, leaseStatus: LeaseStatus.EXPIRED },
    { id: 'u4', estateId: 'e3', unitName: 'Delta Foods', proprietorName: 'Lisa White', activityType: 'Food Processing', employeeCount: 18, leaseStatus: LeaseStatus.ACTIVE },
  ],
  leases: [
    { id: 'l1', unitId: 'u1', startDate: '2023-01-01', endDate: '2025-12-31', agreementNumber: 'AGR-001', status: LeaseStatus.ACTIVE },
    { id: 'l2', unitId: 'u2', startDate: '2022-06-15', endDate: '2024-06-14', agreementNumber: 'AGR-002', status: LeaseStatus.ACTIVE },
    { id: 'l3', unitId: 'u3', startDate: '2020-01-01', endDate: '2023-12-31', agreementNumber: 'AGR-003', status: LeaseStatus.EXPIRED },
    { id: 'l4', unitId: 'u4', startDate: '2024-01-01', endDate: '2026-12-31', agreementNumber: 'AGR-004', status: LeaseStatus.ACTIVE },
  ],
  rentRecords: [
    { id: 'r1', unitId: 'u1', amount: 5000, dueDate: '2024-03-01', paidDate: '2024-03-02', status: RentStatus.PAID },
    { id: 'r2', unitId: 'u1', amount: 5000, dueDate: '2024-04-01', status: RentStatus.DUE },
    { id: 'r3', unitId: 'u2', amount: 3500, dueDate: '2024-03-01', status: RentStatus.OVERDUE },
    { id: 'r4', unitId: 'u3', amount: 8000, dueDate: '2024-01-01', status: RentStatus.OVERDUE },
  ],
  users: [
    { id: 'usr1', name: 'System Admin', email: 'admin@sicop.gov', role: UserRole.ADMIN },
    { id: 'usr2', name: 'Estate Manager', email: 'manager@sicop.gov', role: UserRole.MANAGER },
    { id: 'usr3', name: 'Alpha Proprietor', email: 'john@alphatech.com', role: UserRole.UNIT_HOLDER, linkedUnitId: 'u1' },
  ],
  currentUser: null,
  auditLogs: []
};

export class JsonStorage {
  static get(): AppState {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : seedData;
  }

  static save(data: AppState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
