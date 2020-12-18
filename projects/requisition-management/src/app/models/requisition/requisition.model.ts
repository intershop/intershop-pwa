import { UserBudget } from 'organization-management';

import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { User } from 'ish-core/models/user/user.model';

export type RequisitionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RequisitionViewer = 'buyer' | 'approver';

export interface RequisitionApproval {
  status: string;
  statusCode: string;
  approvalDate?: number;
  approver?: { firstName: string; lastName: string };
  approvalComment?: string;
  customerApprovers?: { firstName: string; lastName: string; email: string }[];
}

export interface RequisitionUserBudget extends UserBudget {
  spentBudgetIncludingThisRequisition?: Price;
  remainingBudgetIncludingThisRequisition?: Price;
}

type RequisitionBasket = Omit<AbstractBasket<LineItem>, 'approval'>;

export interface Requisition extends RequisitionBasket {
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;

  user: User;
  userBudget: RequisitionUserBudget;
  approval: RequisitionApproval;
}
