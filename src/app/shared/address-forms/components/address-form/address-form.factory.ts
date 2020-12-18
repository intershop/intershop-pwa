import { FormControl, FormGroup, Validators } from '@angular/forms';

export abstract class AddressFormFactory {
  countryCode = 'default';
  countryLabel = '';

  isBusinessCustomer = false;

  group(): FormGroup {
    return new FormGroup({});
  }

  getGroup(param?: { isBusinessAddress?: boolean; value? }): FormGroup {
    // get formGroup according to the country specific factory
    const newGroup = this.group();

    // add countryCode form controls
    newGroup.addControl('countryCode', new FormControl(''));

    if (param?.isBusinessAddress) {
      newGroup.addControl('companyName1', new FormControl('', Validators.required));
      newGroup.addControl('companyName2', new FormControl(''));
    }

    // apply values to the new form
    if (param?.value) {
      newGroup.patchValue(param.value);
    }
    return newGroup;
  }
}
