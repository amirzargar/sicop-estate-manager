
import { StorageService } from '../infrastructure/mockStorage';
import { EstateDTO, UnitDTO, RentRecordDTO, RentStatus, UserDTO, UserRole, LeaseDTO } from '../shared/types';
import { calculateTotalDue, validateUnitCapacity } from '../domain/entities';

export class EstateUseCases {
  static getAllEstates(): EstateDTO[] {
    return StorageService.getData().estates;
  }

  static createEstate(estate: Omit<EstateDTO, 'id'>): void {
    const data = StorageService.getData();
    const newEstate: EstateDTO = { ...estate, id: `e${Date.now()}` };
    data.estates.push(newEstate);
    StorageService.saveData(data);
  }

  static getEstateStats(estateId: string) {
    const data = StorageService.getData();
    const units = data.units.filter(u => u.estateId === estateId);
    const totalRentDue = data.rentRecords
      .filter(r => units.some(u => u.id === r.unitId) && r.status !== RentStatus.PAID)
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      unitCount: units.length,
      totalRentDue,
      occupancy: units.length / data.estates.find(e => e.id === estateId)!.totalUnits
    };
  }
}

export class UnitUseCases {
  static getAllUnits(): UnitDTO[] {
    return StorageService.getData().units;
  }

  static getUnitsByEstate(estateId: string): UnitDTO[] {
    return StorageService.getData().units.filter(u => u.estateId === estateId);
  }

  static addUnit(unit: Omit<UnitDTO, 'id'>): void {
    const data = StorageService.getData();
    const estate = data.estates.find(e => e.id === unit.estateId);
    const existingUnits = data.units.filter(u => u.estateId === unit.estateId).length;

    if (estate && !validateUnitCapacity(estate.totalUnits, existingUnits)) {
      throw new Error('Estate is at full capacity');
    }

    const newUnit: UnitDTO = { ...unit, id: `u${Date.now()}` };
    data.units.push(newUnit);
    StorageService.saveData(data);
  }
}

export class RentUseCases {
  static getRentRecordsByUnit(unitId: string): RentRecordDTO[] {
    return StorageService.getData().rentRecords.filter(r => r.unitId === unitId);
  }

  static collectRent(recordId: string): void {
    const data = StorageService.getData();
    const index = data.rentRecords.findIndex(r => r.id === recordId);
    if (index !== -1) {
      data.rentRecords[index].status = RentStatus.PAID;
      data.rentRecords[index].paidDate = new Date().toISOString().split('T')[0];
      StorageService.saveData(data);
    }
  }

  static getGlobalRentSummary() {
    const data = StorageService.getData();
    return {
      totalCollected: data.rentRecords.filter(r => r.status === RentStatus.PAID).reduce((s, r) => s + r.amount, 0),
      totalDue: calculateTotalDue(data.rentRecords)
    };
  }
}

export class UserUseCases {
  static login(email: string): UserDTO | null {
    const data = StorageService.getData();
    const user = data.users.find(u => u.email === email);
    if (user) {
      data.currentUser = user;
      StorageService.saveData(data);
      return user;
    }
    return null;
  }

  static logout(): void {
    const data = StorageService.getData();
    data.currentUser = null;
    StorageService.saveData(data);
  }

  static getCurrentUser(): UserDTO | null {
    return StorageService.getData().currentUser;
  }
}
