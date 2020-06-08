export interface UserBudgets {
  budget: { currency: string; value: number };
  budgetPeriod: string;
  orderSpentLimit: { currency: string; value: number };
  remainingBudget: { currency: string; value: number };
  type: 'UserBudgets';
}
