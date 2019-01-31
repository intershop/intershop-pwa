import { Address } from '../address/address.model';

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

  businessPartnerNo?: string;
  department?: string;
}
