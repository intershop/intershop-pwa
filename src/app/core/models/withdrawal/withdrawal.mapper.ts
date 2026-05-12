import { WithdrawalData } from './withdrawal.interface';
import { Withdrawal } from './withdrawal.model';

export class WithdrawalMapper {
  static fromData(payload: WithdrawalData): Withdrawal {
    if (payload) {
      return { id: payload.id, ...payload.data };
    } else {
      throw new Error(`'WithdrawalData' is required for the mapping`);
    }
  }
}
