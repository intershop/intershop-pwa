import { InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';

export const ADDRESS_FORM_FACTORY = new InjectionToken<AddressFormFactory>('Address Form Factory');

export abstract class AddressFormFactory {
  countryCode = 'default';
  countryLabel = '';

  group(): FormGroup {
    return new FormGroup({});
  }

  getGroup(value?: { [key: string]: any }): FormGroup {
    const newGroup = this.group();
    if (value) { newGroup.patchValue(value); }
    return newGroup;
  }

}
