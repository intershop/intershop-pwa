import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from '../address-form/address-form.factory';

@Injectable()
export class AddressFormDEFactory extends AddressFormFactory {

  countryCode = 'DE';

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
      addressLine3: [],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', Validators.required],
      phoneHome: ['']
    });
  }

}
