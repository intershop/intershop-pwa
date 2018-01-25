import { FormGroup } from '@angular/forms';
import { CountryFactory } from '../country/country.factory';
import { FactoryHelper } from '../factory-helper';
import { AddressData } from './address.interface';
import { Address } from './address.model';

export class AddressFactory {

  static fromData(data: AddressData): Address {
    const address: Address = new Address();
    FactoryHelper.primitiveMapping<AddressData, Address>(data, address);
    if (data.country) {
      address.country = CountryFactory.fromData(data.country);
    }
    return address;
  }

  static fromForm(form: FormGroup) {
    if (!form) {
      return null;
    }
    const address: Address = new Address();
    FactoryHelper.primitiveMapping<FormGroup, Address>(form.value, address);
    return address;
  }
}
