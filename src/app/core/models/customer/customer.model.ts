import { Address } from '../address/address.model';
import { Credentials } from '../credentials/credentials.model';

export type CustomerType = 'PrivateCustomer' | 'SMBCustomer';

export interface Customer {
  type?: CustomerType;
  customerNo: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;

  // Private Customer only
  title?: string;
  firstName?: string;
  lastName?: string;
  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email?: string;
  preferredLanguage?: string;
  birthday?: string;

  // Business Customer only
  companyName?: string;
  companyName2?: string;
  taxationID?: string;
  industry?: string;
  description?: string;

  // for registration only
  address?: Address;
  credentials?: Credentials;
}
