import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';
import { Price } from 'ish-core/models/price/price.model';

export interface CostCenterBuyer extends BasketApprover {
  budget: Price;
  budgetPeriod: string;
  spentBudget?: Price;
}

export interface CostCenter {
  id: string; // uuid
  costCenterId: string;
  name: string;
  costCenterOwner: BasketApprover;
  budget: Price;
  budgetPeriod: string;
  spentBudget?: Price;
  buyers?: CostCenterBuyer[];
}
