import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';

import { Customer } from './customer.model';

export type CustomerType = 'PrivateCustomer' | 'SMBCustomer';

/**
 * response data type for signIn user
 */
export interface CustomerData extends Customer {
  type: CustomerType;
  title?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;

  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email?: string;
  login?: string;

  preferredLanguage?: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
  preferredPaymentInstrument?: PaymentInstrument;
}
