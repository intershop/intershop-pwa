import { CustomerData } from './customer.interface';
import { Customer, CustomerUserType } from './customer.model';

export class CustomerMapper {
  /**
   * Get User data for the logged in Business Customer.
   */
  static mapLoginData(data: CustomerData): CustomerUserType {
    return data.type === 'SMBCustomer'
      ? {
          customer: CustomerMapper.fromData(data),
          user: undefined,
        }
      : {
          customer: CustomerMapper.fromData(data),
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
            preferredInvoiceToAddressUrn: data.preferredInvoiceToAddress && data.preferredInvoiceToAddress.urn,
            preferredShipToAddressUrn: data.preferredShipToAddress && data.preferredShipToAddress.urn,
            preferredPaymentInstrumentId: data.preferredPaymentInstrument && data.preferredPaymentInstrument.id,
            birthday: data.birthday,
          },
        };
  }

  /**
   * Map customer data in dependence of the customer type (PrivateCustomer/SMBCustomer)
   */
  static fromData(data: CustomerData): Customer {
    return data.type === 'SMBCustomer'
      ? {
          customerNo: data.customerNo,
          type: data.type,
          isBusinessCustomer: true,
          companyName: data.companyName,
          companyName2: data.companyName2,
          taxationID: data.taxationID,
          industry: data.industry,
          description: data.description,
        }
      : {
          customerNo: data.customerNo,
          type: data.type,
          isBusinessCustomer: false,
        };
  }
}
