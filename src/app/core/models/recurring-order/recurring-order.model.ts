import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';
import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { User } from 'ish-core/models/user/user.model';

type OrderBasket = Omit<AbstractBasket<LineItem>, 'approval'>;

export interface RecurringOrder extends OrderBasket {
  documentNo: string;
  active: boolean;
  expired: boolean;
  // error flag if the recurring orders was set to inactive by the system
  error?: boolean;
  errorCode?: string;
  statusCode?: string;

  recurrence: Recurrence;

  creationDate: string;
  lastOrderDate?: string;
  nextOrderDate?: string;
  orderCount?: number;
  costCenterId?: string;
  costCenterName?: string;
  approvalStatuses?: { approvalDate: number; approver: BasketApprover; statusCode: string }[];

  lastPlacedOrders?: { id: string; documentNumber: string; creationDate: string }[];

  user: User & { companyName: string };
}
