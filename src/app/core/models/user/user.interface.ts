import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';

/**
 * user data from ICM used for business users only
 */
export interface UserData {
  title?: string;
  firstName: string;
  lastName: string;
  birthday?: string;

  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email: string;
  login: string;

  preferredLanguage?: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
  preferredPaymentInstrument?: PaymentInstrument;

  businessPartnerNo?: string;
  department?: string;
}
