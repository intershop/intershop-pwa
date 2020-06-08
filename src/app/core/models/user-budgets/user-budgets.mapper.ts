import { UserBudgetsData } from './user-budgets.interface';
import { UserBudgets } from './user-budgets.model';

export class UserBudgetsMapper {
  static fromData(data: UserBudgetsData): UserBudgets {
    return data
      ? {
          ...data,
        }
      : undefined;
  }
}
