import { CustomerData } from './customer.interface';
import { CustomerLoginType } from './customer.model';

export class CustomerMapper {
  /**
   * Get User data for the logged in Business Customer.
   */
  static mapLoginData(data: CustomerData): CustomerLoginType {
    return data.type === 'SMBCustomer'
      ? {
          customer: {
            customerNo: data.customerNo,
            type: data.type,
            companyName: data.companyName,
            companyName2: data.companyName2,
            taxationID: data.taxationID,
            industry: data.industry,
            description: data.description,
          },
          user: undefined,
        }
      : {
          customer: {
            customerNo: data.customerNo,
            type: data.type,
          },
          user: {
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            preferredLanguage: data.preferredLanguage,
            phoneHome: data.phoneHome,
            phoneBusiness: data.phoneBusiness,
            phoneMobile: data.phoneMobile,
            fax: data.fax,
            email: data.email,
            preferredInvoiceToAddressUrn: data.preferredInvoiceToAddress
              ? data.preferredInvoiceToAddress.urn
              : undefined,
            preferredShipToAddressUrn: data.preferredShipToAddress ? data.preferredShipToAddress.urn : undefined,
            birthday: data.birthday,
          },
        };
  }
}
