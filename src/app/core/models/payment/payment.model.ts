import { PaymentInstrument } from '../payment-instrument/payment-instrument.model';

/**
 * Payment which is saved at basket and order
 */

export interface Payment {
  id: string;
  paymentInstrument: PaymentInstrument;
  displayName?: string;
  status?: string;
  description?: string;

  // obsolete with order REST api V1
  number?: string; // account identifier
}
