import { AddressData } from '../address/address.interface';
import { CredentialsData } from '../credentials/credentials.interface';

export interface CustomerData {
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
  credentials: CredentialsData;
  address?: AddressData;
  preferredInvoiceToAddress?: AddressData;
  preferredShipToAddress?: AddressData;
}
