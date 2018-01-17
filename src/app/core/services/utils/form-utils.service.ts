import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormUtilsService {

  markAsDirtyRecursive(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      if (formGroup.controls[key] instanceof FormGroup) {
        this.markAsDirtyRecursive(formGroup.controls[key] as FormGroup);
      } else {
        formGroup.controls[key].markAsDirty();
        formGroup.controls[key].updateValueAndValidity();
      }
    });
  }
}
