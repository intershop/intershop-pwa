import { Inject, Injectable } from '@angular/core';
import { ADDRESS_FORM_FACTORY, AddressFormFactory } from './forms/address-form.factory';
import { FormGroup } from '@angular/forms';

@Injectable()
export class AddressFormService {

  private countriesForDefault = [
    {
      countryCode: 'CN',
      countryLabel: 'China'
    },
    {
      countryCode: 'IN',
      countryLabel: 'Indien'
    }
  ];

  constructor(@Inject(ADDRESS_FORM_FACTORY) private factories: AddressFormFactory[]) { }

  replaceGroupForCountry(group: FormGroup, controlName: string, countryCode: string) {
    const oldFormValue = group.get(controlName).value;
    const addressGroup = this.getFactory(countryCode).getGroup(oldFormValue);

    group.setControl(controlName, group);
  }

  getFactory(countryCode: string = 'default'): AddressFormFactory {
    let factory = this.findFactory(countryCode);
    if (!factory) { factory = this.findFactory('default'); }
    return factory;
  }

  private findFactory(countryCode: string): AddressFormFactory {
    return this.factories.find(f => f.countryCode === countryCode);
  }
}
