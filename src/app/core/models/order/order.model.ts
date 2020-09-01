import { Basket } from 'ish-core/models/basket/basket.model';

export interface Order extends Basket {
  documentNo: string;
  creationDate: number;
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
