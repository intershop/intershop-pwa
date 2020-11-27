import { Price } from 'ish-core/models/price/price.model';

export interface UserBudget {
  budget: Price;
  budgetPeriod: string;
  orderSpentLimit: Price;
  remainingBudget?: Price;
  spentBudget?: Price;
}
