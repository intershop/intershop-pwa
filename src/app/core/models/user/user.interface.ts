import { Address } from '../address/address.model';

// used for business users only
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  preferredLanguage: string;

  title?: string;
  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
  birthday?: string;

  businessPartnerNo?: string;
  department?: string;
}
