import { Address } from '../address/address.model';
import { Customer } from './customer.model';

export interface PrivateCustomer extends Customer {
  firstName: string;
  lastName: string;
  title: string;
  phoneHome: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email: string;
  birthday: string;
  preferredLanguage: string;
  address?: Address;
}
