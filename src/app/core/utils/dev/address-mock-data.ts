import { FormControl, FormGroup } from '@angular/forms';

export class AddressMockData {
  static getAddressForm(countryCode = 'BG'): FormGroup {
    return new FormGroup({
      countryCode: new FormControl(countryCode),
      title: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      addressLine3: new FormControl(''),
      postalCode: new FormControl(''),
      city: new FormControl(''),
      mainDivisionCode: new FormControl(''),
    });
  }
}
