import { AbstractControl, ValidatorFn } from '@angular/forms';
export const passwordValidate: ValidatorFn = (control: AbstractControl): { [key: string]: any } => {
  const PASSWORD_REGEXP = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9!@#$%^&*()_+}{?><:"\S]{7,})$/;
  if (!control.value) {
    return null;
  } else {
    return PASSWORD_REGEXP.test(control.value) ? null : {
      validatePassword: {
        valid: true
      }
    };
  }
};