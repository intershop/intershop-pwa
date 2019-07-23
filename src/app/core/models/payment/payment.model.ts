import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';

/**
 * Payment which is saved at basket and order
 */

export interface Payment {
  id: string;
  paymentInstrument: PaymentInstrument;
  capabilities?: string[];
  displayName?: string;
  status?: string;
  description?: string;
  redirectUrl?: string;
  redirect?: {
    parameters?: {
      name: string;
      value: string;
    }[];
    status: 'SUCCESS' | 'FAILURE' | 'CANCEL';
  };
  redirectRequired?: boolean;

  // obsolete with order REST api V1
  number?: string; // account identifier
}
