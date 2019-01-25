import { Address } from '../address/address.model';
import { Credentials } from '../credentials/credentials.model';
import { User } from '../user/user.model';

export type CustomerType = 'PrivateCustomer' | 'SMBCustomer';

export interface Customer {
  type: CustomerType;
  customerNo: string;

  // Business Customer only
  companyName?: string;
  companyName2?: string;
  taxationID?: string;
  industry?: string;
  description?: string;
}

/**
 * login result response data type, for business customers user data are missing and have to be fetched seperately
 */
export interface CustomerLoginType {
  customer: Customer;
  user?: User;
}

/**
 * registration request data type
 */
export interface CustomerRegistrationType extends CustomerLoginType {
  credentials: Credentials;
  address: Address;
}
