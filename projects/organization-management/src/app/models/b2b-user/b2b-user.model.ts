import { User } from 'ish-core/models/user/user.model';

import { UserBudget } from '../user-budget/user-budget.model';

export interface B2bUser extends Partial<User> {
  roleIDs?: string[];
  active?: boolean;
  userBudget?: UserBudget;
}
