import { Address } from '../address/address.model';

export enum UserType {
  PrivateCustomer = 'PrivateCustomer',
  SMBCustomerUser = 'SMBCustomerUser',
}

export interface User {
  type: UserType;
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

  // Private User only
  customerNo?: string;

  // Business User only
  businessPartnerNo?: string;
  department?: string;
}
