import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';

/**
 * Payment which is saved at basket and order
 */

export interface Payment {
  id: string;
  capabilities?: string[];
  description?: string;
  displayName?: string;
  paymentInstrument: PaymentInstrument;
  redirectUrl?: string;
  redirect?: {
    parameters?: {
      name: string;
      value: string;
    }[];
    status: 'SUCCESS' | 'FAILURE' | 'CANCEL';
  };
  redirectRequired?: boolean;
  status?: string;
}
