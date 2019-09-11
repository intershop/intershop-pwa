import { Inject, Injectable, InjectionToken } from '@angular/core';

import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';

export const ADDRESS_FORM_FACTORY = new InjectionToken<AddressFormFactory>('Address Form Factory');

@Injectable()
export class AddressFormFactoryProvider {
  constructor(@Inject(ADDRESS_FORM_FACTORY) private factories: AddressFormFactory[]) {}

  /*
    gets the appropriate address factory for the given countryCode
  */
  getFactory(countryCode: string = 'default'): AddressFormFactory {
    let factory = this.findFactory(countryCode);
    if (!factory) {
      factory = this.findFactory('default');
    }
    return factory;
  }

  private findFactory(countryCode: string): AddressFormFactory {
    return this.factories.find(f => f.countryCode === countryCode);
  }
}
