
import { LeaseDTO, LeaseStatus, RentRecordDTO, RentStatus } from '../shared/types';

// Use LeaseDTO instead of non-existent Lease
export const isLeaseExpired = (lease: LeaseDTO): boolean => {
  const today = new Date();
  const endDate = new Date(lease.endDate);
  return today > endDate;
};

// Use LeaseDTO instead of non-existent Lease
export const getLeaseStatusText = (lease: LeaseDTO): LeaseStatus => {
  if (isLeaseExpired(lease)) return LeaseStatus.EXPIRED;
  return lease.status;
};

// Use RentRecordDTO instead of non-existent RentRecord
export const calculateTotalDue = (records: RentRecordDTO[]): number => {
  return records
    .filter(r => r.status !== RentStatus.PAID)
    .reduce((sum, r) => sum + r.amount, 0);
};

export const validateUnitCapacity = (totalUnits: number, currentUnits: number): boolean => {
  return currentUnits < totalUnits;
};

export const canUserManageEstates = (role: string): boolean => {
  return [ 'ADMIN', 'MANAGER' ].includes(role);
};
