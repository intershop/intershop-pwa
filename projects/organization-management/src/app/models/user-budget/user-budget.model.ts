import { Price, PriceType } from 'ish-core/models/price/price.model';

export interface UserBudget {
  budget: Price;
  budgetPeriod: string;
  orderSpentLimit: Price;
  budgetPriceType?: PriceType;
  remainingBudget?: Price;
  spentBudget?: Price;
}
