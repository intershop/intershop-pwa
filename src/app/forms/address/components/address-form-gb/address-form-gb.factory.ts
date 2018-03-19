import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from '../address-form/address-form.factory';

@Injectable()
export class AddressFormGBFactory extends AddressFormFactory {

  countryCode = 'GB';

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
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$')]],
      phoneHome: ['']
    });
  }

}
