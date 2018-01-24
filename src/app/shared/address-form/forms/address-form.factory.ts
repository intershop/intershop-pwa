import { Injectable, InjectionToken } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export const ADDRESS_FACTORY = new InjectionToken<AddressFormFactory>('Address Form Factory');

export abstract class AddressFormFactory {
  countryCode = 'default';
  countryLabel = '';

  group(): FormGroup {
    return new FormGroup({});
  }

  getGroup(value?: {[key: string]: any}): FormGroup {
    const newGroup = this.group();
    if (value) { newGroup.patchValue(value); }
    console.log('get group');
    return newGroup;
  }

}
