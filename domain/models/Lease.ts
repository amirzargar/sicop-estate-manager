
import { LeaseDTO, LeaseStatus } from '../../shared/types';

export class Lease {
  constructor(private props: LeaseDTO) {}

  get id() { return this.props.id; }
  get unitId() { return this.props.unitId; }
  get endDate() { return this.props.endDate; }
  get status() { return this.props.status; }

  isExpired(): boolean {
    return new Date(this.props.endDate) < new Date();
  }

  canRenew(): boolean {
    return [LeaseStatus.ACTIVE, LeaseStatus.EXPIRED].includes(this.props.status);
  }

  calculateRemainingDays(): number {
    const diff = new Date(this.props.endDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  toDTO(): LeaseDTO {
    return { ...this.props, status: this.isExpired() ? LeaseStatus.EXPIRED : this.props.status };
  }
}
