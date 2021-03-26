import { Inject, Injectable, InjectionToken } from '@angular/core';

import { AddressFormConfiguration } from './address-form.configuration';

export const ADDRESS_FORM_CONFIGURATION = new InjectionToken<AddressFormConfiguration>('Address Form Factory');

@Injectable()
export class AddressFormConfigurationProvider {
  constructor(@Inject(ADDRESS_FORM_CONFIGURATION) private configurations: AddressFormConfiguration[]) {}

  /**
   * gets the appropriate address configuration for the given countryCode
   */
  getConfiguration(
    countryCode: string = '',
    businessCustomer: boolean = false,
    shortForm: boolean = false
  ): AddressFormConfiguration {
    let configuration = this.findConfiguration(countryCode);
    if (!configuration) {
      configuration = this.findConfiguration('');
    }
    configuration.businessCustomer = businessCustomer;
    configuration.shortForm = shortForm;
    return configuration;
  }

  private findConfiguration(countryCode: string): AddressFormConfiguration {
    return this.configurations.find(f => f.countryCode === countryCode);
  }
}
