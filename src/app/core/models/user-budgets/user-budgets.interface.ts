import { Price } from 'ish-core/models/price/price.model';
export interface UserBudgetsData {
  budget: Price;
  budgetPeriod: string;
  orderSpentLimit: Price;
  remainingBudget: Price;
  type: 'UserBudgets';
}
