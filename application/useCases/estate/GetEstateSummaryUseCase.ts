
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';
import { Estate } from '../../../domain/models/Estate';

export class GetEstateSummaryUseCase {
  static execute() {
    const data = JsonStorage.get();
    return data.estates.map(e => {
      const units = data.units.filter(u => u.estateId === e.id);
      const model = new Estate(e, units);
      return {
        id: e.id,
        name: e.name,
        occupancy: model.getOccupancyRate(),
        unitCount: units.length,
        capacity: e.totalUnits
      };
    });
  }
}
