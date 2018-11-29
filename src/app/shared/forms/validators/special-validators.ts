import { FormControl } from '@angular/forms';

export class SpecialValidators {
  // password: char + numbers, min length 7
  static password(control: FormControl): { [error: string]: { valid: boolean } } {
    const passwordPattern = /^(?=[^\s]*[a-zA-Z])(?=[^\s]*[\d])[^\s]*$/;
    return passwordPattern.test(control.value) && control.value.length > 6 ? undefined : { password: { valid: false } };
  }

  // no special charactors are allowed
  static noSpecialChars(control: FormControl): { [error: string]: { valid: boolean } } {
    const noSpecialCharsPattern = /^[^\<\>\&\@\;\%\*\#\|\_\[\]\!\?\~\+\{\}\(\)\:]*$/;
    return noSpecialCharsPattern.test(control.value) ? undefined : { noSpecialChars: { valid: false } };
  }

  // integer
  static integer(control: FormControl): { [error: string]: { valid: boolean } } {
    const integerPattern = /^(?:-?(?:0|[1-9][0-9]*)|)$/;
    return integerPattern.test(control.value) ? undefined : { integer: { valid: false } };
  }
}
