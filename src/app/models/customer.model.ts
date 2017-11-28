import { Address } from './address.model';
import { Credentials } from './credentials.model';

export class Customer {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  title?: string;
  phoneHome?: string;
  phoneBusiness?: string;
  fax?: string;
  email: string;
  phoneMobile?: string;
  customerNo: string;
  birthday?: string;
  preferredLanguage?: string;
  credentials: Credentials;
  address?: Address;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
}
