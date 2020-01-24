import { Address } from 'ish-core/models/address/address.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';

// used for business users only
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

  preferredLanguage: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
  preferredPaymentInstrument?: PaymentInstrument;

  businessPartnerNo?: string;
  department?: string;
}
