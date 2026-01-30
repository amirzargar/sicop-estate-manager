
import { RentRecordDTO, RentStatus } from '../../shared/types';

export class RentRecord {
  constructor(private props: RentRecordDTO) {}

  get id() { return this.props.id; }
  get amount() { return this.props.amount; }
  get status() { return this.props.status; }
  get dueDate() { return this.props.dueDate; }

  isOverdue(): boolean {
    if (this.props.status === RentStatus.PAID) return false;
    return new Date(this.props.dueDate) < new Date();
  }

  markAsPaid(date: string): RentRecordDTO {
    return {
      ...this.props,
      status: RentStatus.PAID,
      paidDate: date
    };
  }

  toDTO(): RentRecordDTO {
    const currentStatus = this.isOverdue() ? RentStatus.OVERDUE : this.props.status;
    return { ...this.props, status: currentStatus };
  }
}
