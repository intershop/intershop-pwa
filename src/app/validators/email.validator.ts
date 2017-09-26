import { AbstractControl, ValidatorFn } from '@angular/forms';
export const emailValidate: ValidatorFn = (control: AbstractControl): { [key: string]: any } => {
  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!control.value) {
    return null;
  } else {
    return EMAIL_REGEXP.test(control.value) ? null : {
      validateEmail: {
        valid: true
      }
    };
  }
};
