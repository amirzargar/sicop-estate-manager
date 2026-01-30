
import { JsonStorage } from '../../../infrastructure/storage/JsonStorage';
import { RentRecord } from '../../../domain/models/RentRecord';
import { EventBus } from '../../events/EventBus';

export class RecordPaymentUseCase {
  static execute(recordId: string): void {
    const data = JsonStorage.get();
    const currentUser = data.currentUser;
    if (!currentUser) throw new Error("Auth required");

    const index = data.rentRecords.findIndex(r => r.id === recordId);
    if (index === -1) throw new Error("Record not found");

    const model = new RentRecord(data.rentRecords[index]);
    const updatedDTO = model.markAsPaid(new Date().toISOString().split('T')[0]);
    
    data.rentRecords[index] = updatedDTO;
    JsonStorage.save(data);

    const unit = data.units.find(u => u.id === updatedDTO.unitId);
    EventBus.publish(
      'RENT_PAID', 
      currentUser, 
      `Rent of ₹${updatedDTO.amount} paid for unit ${unit?.unitName || updatedDTO.unitId}`,
      { recordId, amount: updatedDTO.amount }
    );
  }
}
