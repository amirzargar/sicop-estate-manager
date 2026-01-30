
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';
import { RentRecordDTO, RentStatus } from '../../../shared/types';
import { RentRules } from '../../../domain/rules/RentRules';

export class RentUseCases {
  static getByUnit(unitId: string): RentRecordDTO[] {
    return JsonStorage.get().rentRecords.filter(r => r.unitId === unitId);
  }

  static getDefaulters(): { unitName: string; amount: number; dueDate: string }[] {
    const data = JsonStorage.get();
    return data.rentRecords
      .filter(r => RentRules.isOverdue(r.dueDate, r.status))
      .map(r => ({
        unitName: data.units.find(u => u.id === r.unitId)?.unitName || 'Unknown',
        amount: r.amount,
        dueDate: r.dueDate
      }));
  }

  static recordPayment(recordId: string): void {
    const data = JsonStorage.get();
    const index = data.rentRecords.findIndex(r => r.id === recordId);
    if (index !== -1) {
      data.rentRecords[index].status = RentStatus.PAID;
      data.rentRecords[index].paidDate = new Date().toISOString().split('T')[0];
      JsonStorage.save(data);
    }
  }

  static getSummary() {
    const data = JsonStorage.get();
    return {
      totalCollected: data.rentRecords.filter(r => r.status === RentStatus.PAID).reduce((s, r) => s + r.amount, 0),
      totalOutstanding: RentRules.calculateTotalOutstanding(data.rentRecords)
    };
  }
}
