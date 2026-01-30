
import { AuditEvent, UserDTO } from '../../shared/types';
import { JsonStorage } from '../../infrastructure/storage/JsonStorage';

export class EventBus {
  static publish(type: string, user: UserDTO, description: string, metadata?: any) {
    const event: AuditEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      userId: user.id,
      userName: user.name,
      description,
      metadata
    };

    const data = JsonStorage.get();
    data.auditLogs = [event, ...(data.auditLogs || [])].slice(0, 100); // Keep last 100
    JsonStorage.save(data);
    
    console.debug(`[Domain Event]: ${type} by ${user.name} - ${description}`);
  }
}
