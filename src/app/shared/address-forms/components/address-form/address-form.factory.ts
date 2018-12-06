import { FormControl, FormGroup } from '@angular/forms';

export abstract class AddressFormFactory {
  countryCode = 'default';
  countryLabel = '';

  group(): FormGroup {
    return new FormGroup({});
  }

  // tslint:disable-next-line:no-any
  getGroup(value?: { [key: string]: any }): FormGroup {
    // get formGroup according to the country specific factory
    const newGroup = this.group();

    // add countryCode form controls
    newGroup.addControl('countryCode', new FormControl(''));

    // apply values to the new form
    if (value) {
      newGroup.patchValue(value);
    }
    return newGroup;
  }
}
