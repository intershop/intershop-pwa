import { FactoryHelper } from '../factory-helper';
import { AddressData } from './address.interface';
import { Address } from './address.model';

export class AddressFactory {

  /*
    Converts addressData interface to address object
  */
  static fromData(data: AddressData): Address {
    const address: Address = new Address();
    FactoryHelper.primitiveMapping<AddressData, Address>(data, address);
    // ToDo: handle countries on addresses
    /* if (data.countryCode) {
       address.country = CountryFactory.fromData(data.countryCode);
     } */
    return address;
  }

  /*
    Converts address object to addressData interface
  */
  static toData(address: Address): AddressData {
    if (!address) {
      return null;
    }
    const addressData = new Object as AddressData;
    FactoryHelper.primitiveMapping<Address, AddressData>(address, addressData);
    return addressData;
  }

  /*
    Converts (form) value to address object
  */
  static fromValue(value: any): Address {
    if (!value) {
      return null;
    }

    const address = new Address();
    FactoryHelper.primitiveMapping<any, Address>(value, address);

    return address;
  }
}
