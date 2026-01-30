
import { UserDTO, UserRole } from '../../shared/types';

export class PermissionRules {
  static canManageEstates(user: UserDTO): boolean {
    return [UserRole.ADMIN, UserRole.MANAGER].includes(user.role);
  }

  static canModifyUnits(user: UserDTO): boolean {
    return [UserRole.ADMIN, UserRole.MANAGER].includes(user.role);
  }

  static canViewFinancials(user: UserDTO, unitId?: string): boolean {
    if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) return true;
    if (user.role === UserRole.UNIT_HOLDER && user.linkedUnitId === unitId) return true;
    return false;
  }

  static canAccessAdminPanel(user: UserDTO): boolean {
    return user.role === UserRole.ADMIN;
  }
}
