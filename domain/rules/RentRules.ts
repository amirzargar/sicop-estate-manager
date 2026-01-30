
import { RentRecordDTO, RentStatus } from '../../shared/types';

export class RentRules {
  static isOverdue(dueDate: string, status: RentStatus): boolean {
    if (status === RentStatus.PAID) return false;
    return new Date(dueDate) < new Date();
  }

  static calculateTotalOutstanding(records: RentRecordDTO[]): number {
    return records
      .filter(r => r.status !== RentStatus.PAID)
      .reduce((sum, r) => sum + r.amount, 0);
  }

  static calculateCollectionRate(records: RentRecordDTO[]): number {
    if (records.length === 0) return 0;
    const paid = records.filter(r => r.status === RentStatus.PAID).length;
    return (paid / records.length) * 100;
  }
}
