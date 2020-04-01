import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';

/**
 * Payment data which are saved at basket and order
 */

export interface PaymentData {
  id: string;
  paymentInstrument: string;
  paymentMethod: string;
  paymentCosts?: PriceItemData;
  redirectRequired: boolean;
  redirect: {
    redirectUrl: string;
  };
  status?: string;
}
