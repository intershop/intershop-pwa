import { User } from '@sentry/browser';

import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';

export interface RequisitionApproval {
  status: string;
  approvalDate?: number;
  approver?: { firstName: string; lastName: string };
  approvalComment?: string;
}

export interface Requisition {
  id: string;
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;
  totals: BasketTotal;

  user: User;
  approval: RequisitionApproval;
}
