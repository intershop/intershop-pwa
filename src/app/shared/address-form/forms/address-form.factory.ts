import { InjectionToken } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export const ADDRESS_FORM_FACTORY = new InjectionToken<AddressFormFactory>('Address Form Factory');

export abstract class AddressFormFactory {
  countryCode = 'default';
  countryLabel = '';

  group(): FormGroup {
    return new FormGroup({});
  }

  getGroup(value?: { [key: string]: any }): FormGroup {
    // get formGroup according to the country specific factory
    const newGroup = this.group();

    // add countryCode form controls
    newGroup.addControl('countryCode', new FormControl(''));

    // apply values to the new form
    if (value) { newGroup.patchValue(value); }
    return newGroup;
  }

}
