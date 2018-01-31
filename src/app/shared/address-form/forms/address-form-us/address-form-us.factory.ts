import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from '../address-form.factory';

@Injectable()
export class AddressFormUSFactory extends AddressFormFactory {

  countryCode = 'US';

  constructor(private fb: FormBuilder) {
    super();
  }

  group() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$')]],
    });
  }

}



