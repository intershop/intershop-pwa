import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';

export interface OrderLineItem extends LineItem {
  name: string;
  description: string;
  fulfillmentStatus: string;
}

type OrderBasket = Omit<AbstractBasket<OrderLineItem>, 'approval'>;

export interface Order extends OrderBasket {
  documentNo: string;
  creationDate: string;
  orderCreation: {
    status: 'COMPLETED' | 'ROLLED_BACK' | 'STOPPED' | 'CONTINUE';
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: 'waiting_for_pending_payments' | 'redirect_urls_required' | 'recurring.order';
      redirectUrl?: string;
    };
  };
  statusCode: string;
  status: string;
  approval?: {
    approverFirstName: string;
    approverLastName: string;
    date: number;
  };
  requisitionNo?: string;
  recurringOrderID?: string;
}
