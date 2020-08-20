import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Injectable()
export class AddressFormFRFactory extends AddressFormFactory {
  countryCode = 'FR';

  constructor(private fb: FormBuilder) {
    super();
  }

  group() {
    return this.fb.group({
      title: [''],
      firstName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      lastName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      addressLine1: ['', Validators.required],
      addressLine2: [],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', Validators.required],
      phoneHome: [''],
    });
  }
}
