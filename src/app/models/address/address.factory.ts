import { FactoryHelper } from '../factory-helper';
import { AddressData } from './address.interface';
import { Address } from './address.model';

export class AddressFactory {

  static fromData(data: AddressData): Address {
    const address: Address = new Address();
    FactoryHelper.primitiveMapping<AddressData, Address>(data, address);
    // ToDo: handle countries on addresses
    /* if (data.countryCode) {
       address.country = CountryFactory.fromData(data.countryCode);
     } */
    return address;
  }

  static fromFormValueToData(formValue: any) {
    if (!formValue) {
      return null;
    }
    const addressData = new Object as AddressData;
    FactoryHelper.primitiveMapping<any, AddressData>(formValue, addressData);
    return addressData;
  }
}
