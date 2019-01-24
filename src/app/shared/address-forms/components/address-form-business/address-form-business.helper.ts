import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// tslint:disable-next-line:project-structure
@Injectable()
export class AddressFormBusinessHelper {
  static addControls(formGroup: FormGroup) {
    formGroup.addControl('companyName1', new FormControl('', Validators.required));
    formGroup.addControl('companyName2', new FormControl(''));
  }
}
