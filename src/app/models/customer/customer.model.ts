import { Address } from '../address/address.model';
import { Credentials } from '../credentials/credentials.model';

export interface Customer {
  type?: string;
  customerNo: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
  credentials?: Credentials;
}
