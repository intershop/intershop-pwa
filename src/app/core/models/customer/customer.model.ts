import { Address } from 'ish-core/models/address/address.model';
import { Captcha } from 'ish-core/models/captcha/captcha.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { User } from 'ish-core/models/user/user.model';

export interface Customer {
  customerNo: string;
  isBusinessCustomer?: boolean;

  // Business Customer only
  companyName?: string;
  companyName2?: string;
  taxationID?: string;
  industry?: string;
  description?: string;

  budgetPriceType?: 'net' | 'gross';
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type CustomerLoginType = CustomerUserType & { pgid?: string };

/**
 * result response data type, for business customers user data are missing and have to be fetched separately
 * update user request data type for both, business and private customers
 */
export type CustomerUserType = {
  customer: Customer;
} & XOR<{ user?: User }, { userId?: string }>;

/**
 * registration request data type
 */
export type CustomerRegistrationType = {
  address: Address;
  credentials?: Credentials;
  subscribedToNewsletter?: boolean;
} & CustomerUserType &
  Captcha;

export interface SsoRegistrationType {
  companyInfo: { companyName1: string; companyName2?: string; taxationID: string };
  budgetPriceType?: 'net' | 'gross';
  address: Address;
  userId: string;
  subscribedToNewsletter?: boolean;
}
