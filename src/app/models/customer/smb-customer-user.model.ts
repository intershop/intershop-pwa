import { Address } from '../address/address.model';

export interface SmbCustomerUser {
  type: string;
  title: string;
  firstName: string;
  lastName: string;
  businessPartnerNo: string;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;
}
