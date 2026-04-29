import { WithdrawalData } from './withdrawal.interface';
import { Withdrawal } from './withdrawal.model';

export class WithdrawalMapper {
  static fromData(payload: WithdrawalData): Withdrawal {
    if (payload) {
      const data = payload.data;
      return {
        id: data.uuid,
        orderDocumentNumber: data.orderDocumentNumber,
        orderEmail: data.orderEmail,
        status: data.status,
        confirmationEmail: data.confirmationEmail,
        name: data.name,
      };
    } else {
      throw new Error(`'WithdrawalData' is required for the mapping`);
    }
  }
}
