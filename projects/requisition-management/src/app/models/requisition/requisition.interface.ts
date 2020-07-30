import { User } from '@sentry/browser';

import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { PriceData } from 'ish-core/models/price/price.interface';

import { RequisitionApproval } from './requisition.model';

export interface RequisitionData {
  id: string;
  requisitionNo: string;
  orderNo?: string;
  creationDate: number;
  lineItemCount: number;
  totals?: BasketTotalData;
  totalGross: PriceData;
  totalNet: PriceData;

  userInformation: User;

  approvalStatus: RequisitionApproval;
}
