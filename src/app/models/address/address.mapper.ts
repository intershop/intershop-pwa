import { AddressData } from './address.interface';
import { Address } from './address.model';

export class AddressMapper {
  static fromData(data: AddressData): Address {
    if (data) {
      return {
        id: data.id,
        urn: data.urn,
        type: data.type,
        addressName: data.addressName,
        companyName1: data.companyName1,
        companyName2: data.companyName2,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressLine3: data.addressLine3,
        postalCode: data.postalCode,
        city: data.city,
        mainDivision: data.mainDivision,
        country: data.country,
        countryCode: data.countryCode,
        phoneHome: data.phoneHome,
        phoneMobile: data.phoneMobile,
        phoneBusiness: data.phoneBusiness,
        phoneBusinessDirect: data.phoneBusinessDirect,
        fax: data.fax,
        email: data.email,
        invoiceToAddress: data.invoiceToAddress,
        shipToAddress: data.shipToAddress,
        shipFromAddress: data.shipFromAddress,
        serviceToAddress: data.serviceToAddress,
        installToAddress: data.installToAddress,
      };
    } else {
      throw new Error(`'addressData' is required for the mapping`);
    }
  }
}
