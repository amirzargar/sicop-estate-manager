
import { LeaseDTO, LeaseStatus } from '../../shared/types';

export class LeaseRules {
  static isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }

  static determineStatus(lease: LeaseDTO): LeaseStatus {
    if (this.isExpired(lease.endDate)) {
      return LeaseStatus.EXPIRED;
    }
    return lease.status;
  }

  static canRenew(lease: LeaseDTO): boolean {
    // Only active or recently expired leases can be renewed
    return [LeaseStatus.ACTIVE, LeaseStatus.EXPIRED].includes(lease.status);
  }
}
