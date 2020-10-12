import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { User } from 'ish-core/models/user/user.model';

export type RequisitionStatus = 'pending' | 'approved' | 'rejected';

export type RequisitionViewer = 'buyer' | 'approver';

export interface RequisitionApproval {
  status: string;
  statusCode: string;
  approvalDate?: number;
  approver?: { firstName: string; lastName: string };
  approvalComment?: string;
  customerApprovers?: { firstName: string; lastName: string; email: string }[];
}

export interface RequisitionUserBudgets {
  budget: Price;
  budgetPeriod: string;
  orderSpentLimit: Price;
  remainingBudget?: Price;
  spentBudget?: Price;
}

export interface Requisition extends AbstractBasket<LineItem> {
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;

  user: User;
  userBudgets: RequisitionUserBudgets;
  approval: RequisitionApproval;
}
