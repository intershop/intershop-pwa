import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketBaseData, BasketIncludedData } from 'ish-core/models/basket/basket.interface';
import { PriceData } from 'ish-core/models/price/price.interface';
import { User } from 'ish-core/models/user/user.model';

import { RequisitionApproval, RequisitionUserBudget } from './requisition.model';

export interface RequisitionBaseData extends BasketBaseData {
  requisitionNo: string;
  orderNo?: string;
  recurringOrderDocumentNo?: string;
  order?: {
    itemId: string;
  };
  creationDate: number;
  lineItemCount: number;
  totalGross: PriceData;
  totalNet: PriceData;

  userInformation: User;
  userBudgets: RequisitionUserBudget;

  approvalStatus: RequisitionApproval;
  approvalStatuses?: { approvalDate: number; approver: BasketApprover; statusCode: string }[];
  systemRejected?: boolean;
  systemRejectErrors?: { code: string; message?: string }[];
}

export interface RequisitionData {
  data: RequisitionBaseData | RequisitionBaseData[];
  included?: BasketIncludedData;
  infos?: BasketInfo[];
}
