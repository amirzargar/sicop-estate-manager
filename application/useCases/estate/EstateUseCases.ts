
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';
import { EstateDTO } from '../../../shared/types';
import { PermissionRules } from '../../../domain/rules/PermissionRules';

export class EstateUseCases {
  static getAll(): EstateDTO[] {
    return JsonStorage.get().estates;
  }

  static create(estate: Omit<EstateDTO, 'id'>): void {
    const data = JsonStorage.get();
    if (!data.currentUser || !PermissionRules.canManageEstates(data.currentUser)) {
      throw new Error('Unauthorized');
    }
    const newEstate: EstateDTO = { ...estate, id: `e${Date.now()}` };
    data.estates.push(newEstate);
    JsonStorage.save(data);
  }

  static getById(id: string): EstateDTO | undefined {
    return JsonStorage.get().estates.find(e => e.id === id);
  }
}
