import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';

@Injectable()
export class AddressFormFRFactory extends AddressFormFactory {
  countryCode = 'FR';

  constructor(private fb: FormBuilder) {
    super();
  }

  group() {
    return this.fb.group({
      title: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', Validators.required],
      phoneHome: [''],
    });
  }
}
