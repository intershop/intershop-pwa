import { Customer } from './customer.model';

export interface SmbCustomer extends Customer {
  companyName: string;
  companyName2?: string;
  taxationID: string;
  industry?: string;
  description?: string;
}
