import { Price } from 'ish-core/models/price/price.model';

export interface UserBudgets {
  budget: Price;
  budgetPeriod: string;
  orderSpentLimit: Price;
  remainingBudget?: Price;
}
