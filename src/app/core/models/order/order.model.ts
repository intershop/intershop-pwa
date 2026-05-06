import { AbstractBasket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { PagingInfo } from 'ish-core/models/paging-info/paging-info.model';

import { OrderCreationStatus, OrderStopActionReason } from './order.interface';

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
    status: OrderCreationStatus;
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: OrderStopActionReason;
      redirectUrl?: string;
    };
    redirect?: {
      parameters: {
        name: string;
        value: string;
      }[];
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
  paginationPosition?: number;
}

export interface Orders {
  orders: Order[];
  paging: PagingInfo;
}
