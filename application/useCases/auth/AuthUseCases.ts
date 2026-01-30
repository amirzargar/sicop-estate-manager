
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';
import { UserDTO } from '../../../shared/types';

export class AuthUseCases {
  static authenticate(email: string): UserDTO | null {
    const data = JsonStorage.get();
    const user = data.users.find(u => u.email === email);
    if (user) {
      data.currentUser = user;
      JsonStorage.save(data);
      return user;
    }
    return null;
  }

  static logout(): void {
    const data = JsonStorage.get();
    data.currentUser = null;
    JsonStorage.save(data);
  }

  static getCurrentUser(): UserDTO | null {
    return JsonStorage.get().currentUser;
  }
}
