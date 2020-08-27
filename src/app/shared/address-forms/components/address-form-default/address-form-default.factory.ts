import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Injectable()
export class AddressFormDefaultFactory extends AddressFormFactory {
  countryCode = 'default';

  constructor(private fb: FormBuilder) {
    super();
  }

  group() {
    return this.fb.group({
      firstName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      lastName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      title: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [],
      addressLine3: [],
      postalCode: ['', [Validators.required]],
      city: ['', Validators.required],
      mainDivisionCode: [''],
      phoneHome: [''],
    });
  }
}
