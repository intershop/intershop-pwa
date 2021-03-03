import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class SpecialValidators {
  /**
   * password validator: char + numbers, min length 7
   */
  static password(control: FormControl): { [error: string]: { valid: boolean } } {
    const passwordPattern = /^(|(?=[^\s]*[a-zA-Z])(?=[^\s]*[\d])[^\s]*)$/;
    return passwordPattern.test(control.value) && (control.value.length > 6 || !control.value.length)
      ? undefined
      : { password: { valid: false } };
  }

  static noSpecialChars(control: FormControl): { [error: string]: { valid: boolean } } {
    const noSpecialCharsPattern = /^[^\<\>\&\@\;\%\*\#\|\_\[\]\!\?\~\+\{\}\(\)\:]*$/;
    return noSpecialCharsPattern.test(control.value) ? undefined : { noSpecialChars: { valid: false } };
  }

  static punchoutLogin(control: FormControl): { [error: string]: { valid: boolean } } {
    const punchoutLoginPattern = /^[a-zA-Z0-9_.@]*$/;
    return punchoutLoginPattern.test(control.value) ? undefined : { punchoutLogin: { valid: false } };
  }

  static integer(control: FormControl): { [error: string]: { valid: boolean } } {
    const integerPattern = /^(?:-?(?:0|[1-9][0-9]*)|)$/;
    return integerPattern.test(control.value) ? undefined : { integer: { valid: false } };
  }

  static email(control: FormControl) {
    /*
     * very simplified email matching
     * - local part mustn't start or end with dot
     * - domain mustn't start or end with dash
     * - no IPs allowed for login emails
     * - only some special characters allowed
     */
    return /^([\w\-\~]+\.)*[\w\-\~]+@(([\w][\w\-]*)?[\w]\.)+[a-zA-Z]{2,}$/.test(control.value)
      ? undefined
      : { email: true };
  }

  /**
   * Compare two form controls for equality.
   *
   * The Validator has to be attached to the parent form group containing both controls under investigation.
   * The first argument control name receives the error if controls do not have an equal value.
   */
  static equalTo(errorReceivingControlName: string, compareControlName: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const errorReceivingControl = group.get(errorReceivingControlName);
      const otherErrorKeys = Object.keys(errorReceivingControl?.errors || {}).filter(x => x !== 'equalTo');

      if (errorReceivingControl && !otherErrorKeys.length) {
        errorReceivingControl.setErrors(
          errorReceivingControl.value === group.get(compareControlName)?.value ? undefined : { equalTo: true }
        );
      }
      return [];
    };
  }

  static equalToControl(otherControlName: string): ValidatorFn {
    return (control: FormControl) => {
      const otherControl = control.parent?.get(otherControlName);
      if (otherControl && otherControl.value !== control.value) {
        return {
          equalTo: { valid: false },
        };
      }
    };
  }

  static moneyAmount(control: FormControl): { [error: string]: { valid: boolean } } {
    const moneyAmountPattern = /^$|^\d{1,9}(\.\d{1,2})?$/;
    return moneyAmountPattern.test(control.value) ? undefined : { moneyAmount: { valid: false } };
  }
}
