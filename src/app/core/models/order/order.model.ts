import { Basket, BasketView } from '../basket/basket.model';

export interface AbstractOrder {
  documentNo: string;
  creationDate: Date;
  orderCreation: {
    status: 'COMPLETED' | 'ROLLED_BACK' | 'STOPPED' | 'CONTINUE';
    stopAction?: {
      type: 'Redirect' | 'Workflow';
      exitReason?: 'waiting_for_pending_payments' | 'redirect_urls_required';
      redirectUrl?: string;
    };
  };
  statusCode: string;
  status: string;
}

export interface Order extends Basket, AbstractOrder {}

export interface OrderView extends BasketView, AbstractOrder {}
