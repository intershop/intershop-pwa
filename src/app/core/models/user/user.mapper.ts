import { Customer } from '../customer/customer.model';

import { UserData } from './user.interface';
import { User } from './user.model';

export class UserMapper {
  // is used for private users
  static fromCustomer(customer: Customer): User {
    return customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          preferredLanguage: customer.preferredLanguage,

          title: customer.title,
          phoneHome: customer.phoneHome,
          phoneBusiness: customer.phoneBusiness,
          phoneMobile: customer.phoneMobile,
          fax: customer.fax,
          preferredInvoiceToAddressUrn: customer.preferredInvoiceToAddress
            ? customer.preferredInvoiceToAddress.urn
            : undefined,
          preferredShipToAddressUrn: customer.preferredShipToAddress ? customer.preferredShipToAddress.urn : undefined,
          birthday: customer.birthday,
        }
      : undefined;
  }

  static fromData(user: UserData): User {
    // is used for business users
    return user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          preferredLanguage: user.preferredLanguage,

          title: user.title,
          phoneHome: user.phoneHome,
          phoneBusiness: user.phoneBusiness,
          phoneMobile: user.phoneMobile,
          fax: user.fax,
          preferredInvoiceToAddressUrn: user.preferredInvoiceToAddress ? user.preferredInvoiceToAddress.urn : undefined,
          preferredShipToAddressUrn: user.preferredShipToAddress ? user.preferredShipToAddress.urn : undefined,
          birthday: user.birthday,
          businessPartnerNo: user.businessPartnerNo,
          department: user.department,
        }
      : undefined;
  }
}
