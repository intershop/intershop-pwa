import { Address } from 'ish-core/models/address/address.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { User } from 'ish-core/models/user/user.model';

export type CustomerType = 'PrivateCustomer' | 'SMBCustomer';

export interface Customer {
  type: CustomerType;
  customerNo: string;
  isBusinessCustomer?: boolean;

  // Business Customer only
  companyName?: string;
  companyName2?: string;
  taxationID?: string;
  industry?: string;
  description?: string;
}

/**
 * login result response data type, for business customers user data are missing and have to be fetched seperately
 * update user request data type for both, business and private customers
 */
export interface CustomerUserType {
  customer: Customer;
  user?: User;
}

/**
 * registration request data type
 */
export interface CustomerRegistrationType extends CustomerUserType {
  credentials: Credentials;
  address: Address;
  captchaResponse?: string;
  captchaAction?: string;
}
