
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';
import { UnitDTO } from '../../../shared/types';
import { LeaseRules } from '../../../domain/rules/LeaseRules';

export class UnitUseCases {
  static getAll(): UnitDTO[] {
    const data = JsonStorage.get();
    // Enforce domain rules on status before returning
    return data.units.map(unit => {
      const lease = data.leases.find(l => l.unitId === unit.id);
      if (lease) {
        unit.leaseStatus = LeaseRules.determineStatus(lease);
      }
      return unit;
    });
  }

  static getByEstate(estateId: string): UnitDTO[] {
    return this.getAll().filter(u => u.estateId === estateId);
  }

  static add(unit: Omit<UnitDTO, 'id'>): void {
    const data = JsonStorage.get();
    const newUnit: UnitDTO = { ...unit, id: `u${Date.now()}` };
    data.units.push(newUnit);
    JsonStorage.save(data);
  }
}
