import { UserData } from './user.interface';
import { User } from './user.model';

export class UserMapper {
  static fromData(user: UserData): User {
    // is used for business users
    return user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          login: user.login,
          preferredLanguage: user.preferredLanguage,
          title: user.title,
          phoneHome: user.phoneHome,
          phoneBusiness: user.phoneBusiness,
          phoneMobile: user.phoneMobile,
          fax: user.fax,
          preferredInvoiceToAddressUrn: user.preferredInvoiceToAddress && user.preferredInvoiceToAddress.urn,
          preferredShipToAddressUrn: user.preferredShipToAddress && user.preferredShipToAddress.urn,
          preferredPaymentInstrumentId: user.preferredPaymentInstrument && user.preferredPaymentInstrument.id,
          birthday: user.birthday,
          businessPartnerNo: user.businessPartnerNo,
          department: user.department,
        }
      : undefined;
  }
}
