import { UserBudget } from 'organization-management';

import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';
import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';

export type RequisitionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RequisitionViewer = 'buyer' | 'approver';

export interface RequisitionApproval {
  status: string;
  statusCode: string;
  approvalDate?: number;
  approvers?: BasketApprover[];
  approvalComment?: string;
  customerApproval?: {
    approvers?: BasketApprover[];
    statusCode?: string;
  };
  costCenterApproval?: {
    approvers?: BasketApprover[];
    statusCode?: string;
    costCenterName?: string;
    costCenterID?: string;
    costCenter?: CostCenter;
  };
}

export interface RequisitionUserBudget extends UserBudget {
  spentBudgetIncludingThisRequisition?: Price;
  remainingBudgetIncludingThisRequisition?: Price;
}

type RequisitionBasket = Omit<AbstractBasket<LineItem>, 'approval'>;

export interface Requisition extends RequisitionBasket {
  requisitionNo: string;
  orderNo?: string;
  recurringOrderDocumentNo?: string;
  creationDate: number;
  lineItemCount: number;

  userBudget: RequisitionUserBudget;
  approval: RequisitionApproval;
  systemRejected?: boolean;
  systemRejectErrors?: string[];
}
