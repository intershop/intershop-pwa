import { Order } from 'ish-core/models/order/order.model';
import { Price } from 'ish-core/models/price/price.model';

export interface CostCenterBuyer {
  login: string;
  budget: Price;
  budgetPeriod: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  spentBudget?: Price;
  approvedOrders?: number;
  pendingOrders?: number;
}

export interface CostCenterBase {
  id: string; // uuid
  costCenterId: string;
  name: string;
  active: boolean;
  costCenterOwner: {
    login: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  budget: Price;
  budgetPeriod: string;
}

export interface CostCenter extends CostCenterBase {
  pendingOrders?: number;
  approvedOrders?: number;
  spentBudget?: Price;
  remainingBudget?: Price;
  buyers?: CostCenterBuyer[];
  orders?: Pick<Order, 'documentNo' | 'creationDate' | 'status' | 'attributes' | 'totalProductQuantity' | 'totals'>[];
}
