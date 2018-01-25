import { Address } from '../address/address.model';
import { Credentials } from '../credentials/credentials.model';


export class Customer {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  title?: string;
  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email: string;
  customerNo: string;
  birthday?: string;
  preferredLanguage?: string;
  credentials: Credentials;
  address?: Address;
  preferredInvoiceToAddress?: Address;
  preferredShipToAddress?: Address;

  getDisplayName(): string {
    return this.firstName || this.credentials.login;
  }

  getFullDisplayName(): string {
    if (this.title !== null) {
      return this.title + ' ' + this.firstName + ' ' + this.lastName;
    }

    return this.firstName + ' ' + this.lastName;
  }
}
