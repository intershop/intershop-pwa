import { UserBudgetsData } from './user-budgets.interface';
import { UserBudgetsMapper } from './user-budgets.mapper';

describe('User Budgets Mapper', () => {
  describe('fromData', () => {
    it(`should return User Budget when getting  UserBudgetData`, () => {
      const userBudgetsData = {
        budget: { currency: 'USD', value: 10000 },
        budgetPeriod: 'monthly',
        orderSpentLimit: { currency: 'USD', value: 500 },
        remainingBudget: { currency: 'USD', value: 10000 },
        type: 'UserBudgets',
      } as UserBudgetsData;
      const userBudgets = UserBudgetsMapper.fromData(userBudgetsData);

      expect(userBudgets).toBeTruthy();
      expect(userBudgets.budget).toBe(userBudgetsData.budget);
      expect(userBudgets.budgetPeriod).toBe(userBudgetsData.budgetPeriod);
      expect(userBudgets.orderSpentLimit).toBe(userBudgetsData.orderSpentLimit);
      expect(userBudgets.remainingBudget).toBe(userBudgetsData.remainingBudget);
    });
  });
});
