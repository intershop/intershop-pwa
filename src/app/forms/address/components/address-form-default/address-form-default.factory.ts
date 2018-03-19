import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from '../address-form/address-form.factory';

@Injectable()
export class AddressFormDefaultFactory extends AddressFormFactory {

  countryCode = 'default';

  constructor(private fb: FormBuilder) {
    super();
  }

  group() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [],
      postalCode: ['', [Validators.required]],
      city: ['', Validators.required],
      state: [''],
      phoneHome: ['']
    });
  }

}
