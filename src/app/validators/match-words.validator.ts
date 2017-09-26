import { FormControl, ValidatorFn } from '@angular/forms';
export function mismatchedValidation(controlName?: string, matchControlName?: string): ValidatorFn {
  return (control: FormControl): { [key: string]: any } => {
    if (!control.parent) {
      return null;
    }
    return (control.parent.get(controlName).value !== control.parent.get(matchControlName).value) ?
      { 'mismatchedValidation': true } : null;
  };
}
