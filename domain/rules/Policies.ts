
import { UserDTO, UserRole } from '../../shared/types';

/**
 * Policies are thin stateless helpers for cross-cutting concerns 
 * like RBAC that don't fit perfectly into a single entity.
 */
export class SecurityPolicy {
  static canPerformSensitiveOperations(user: UserDTO): boolean {
    return [UserRole.ADMIN, UserRole.MANAGER].includes(user.role);
  }

  static canViewFinancials(user: UserDTO, ownerId?: string): boolean {
    if (this.canPerformSensitiveOperations(user)) return true;
    return user.id === ownerId;
  }
}
