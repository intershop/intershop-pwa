import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * A helper function that transforms the special validators to a formly-usable function.
 *
 * @param name the error to be extracted from the validator
 * @param validator the validator that should be transformed
 * @returns a function that conforms the type signature formly expects.
 *
 * @usageNotes
 * Refer to the [`FormlyFieldConfig.validators`](https://github.com/ngx-formly/ngx-formly/blob/main/src/core/src/lib/models/fieldconfig.ts#L60) type definition for an explanation of the necessary validator format.
 *
 */
export function formlyValidation<T extends (control: FormControl) => { [error: string]: { valid: boolean } }>(
  name: string,
  validator: T
): (control: FormControl) => boolean {
  return c => {
    const validationResult = validator(c);
    if (!c) {
      return;
    }
    return validationResult?.[name]?.valid ?? true;
  };
}

export class SpecialValidators {
  /**
   * password validator: char + numbers, min length 7
   */
  static password(control: FormControl): { [error: string]: { valid: boolean } } {
    const passwordPattern = /^(|(?=[^\s]*[a-zA-Z])(?=[^\s]*[\d])[^\s]*)$/;
    if (!control.value) {
      return;
    }
    return passwordPattern.test(control.value) && control.value.length > 6 ? undefined : { password: { valid: false } };
  }

  static noSpecialChars(control: FormControl): { [error: string]: { valid: boolean } } {
    const noSpecialCharsPattern = /^[^\<\>\&\@\;\%\*\#\|\_\[\]\!\?\~\+\{\}\(\)\:]*$/;
    return noSpecialCharsPattern.test(control.value) ? undefined : { noSpecialChars: { valid: false } };
  }

  /**
   * Prevent "<" and ">" to avoid usage of HTML tags.
   */
  static noHtmlTags(control: FormControl): { [error: string]: { valid: boolean } } {
    const noHtmlTagsPattern = /^[^\<\>]*$/;
    return noHtmlTagsPattern.test(control.value) ? undefined : { noHtmlTags: { valid: false } };
  }

  static punchoutLogin(control: FormControl): { [error: string]: { valid: boolean } } {
    const punchoutLoginPattern = /^[a-zA-Z0-9_.@]*$/;
    return punchoutLoginPattern.test(control.value) ? undefined : { punchoutLogin: { valid: false } };
  }

  static integer(control: FormControl): { [error: string]: { valid: boolean } } {
    const integerPattern = /^(?:-?(?:0|[1-9][0-9]*)|)$/;
    return integerPattern.test(control.value) ? undefined : { integer: { valid: false } };
  }

  static email(control: FormControl): { [error: string]: { valid: boolean } } {
    /*
     * very simplified email matching
     * - local part mustn't start or end with dot
     * - domain mustn't start or end with dash
     * - no IPs allowed for login emails
     * - only some special characters allowed
     */
    return /^([\w\-\~\+]+\.)*[\w\-\~\+]+@(([\w][\w\-]*)?[\w]\.)+[a-zA-Z]{2,}$/.test(control.value)
      ? undefined
      : { email: { valid: false } };
  }

  static emailList(control: FormControl): { [error: string]: { valid: boolean } } {
    /*
     * (see "email" validator)
     * - comma-separated list of email addresses
     */
    return /^([\w\-\~\+]+\.)*[\w\-\~\+]+@(([\w][\w\-]*)?[\w]\.)+[a-zA-Z]{2,}(,\s*([\w\-\~\+]+\.)*[\w\-\~\+]+@(([\w][\w\-]*)?[\w]\.)+[a-zA-Z]{2,})*$/.test(
      control.value
    )
      ? undefined
      : { emailList: { valid: false } };
  }

  static phone(control: FormControl): { [error: string]: { valid: boolean } } {
    /*
     * simplified phone matching
     * - phone number must start with + or digit
     * - number blocks can be separated with hyphens or spaces
     * - number blocks can stand in brackets
     * - phone number must have 7 to 15 digits
     */
    return control.value
      ? /^((?:\+?\d{7,15})$)|^((\(?\d{3}\)?(?: |-)?){2}\(?\d{3,4}\)?)$/.test(control.value)
        ? undefined
        : { phone: { valid: false } }
      : undefined;
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
          errorReceivingControl.value === group.get(compareControlName)?.value
            ? undefined
            : { equalTo: { valid: false } }
        );
      }
      return [];
    };
  }

  /**
   * A form control is required if a related form control is not empty.
   *
   * The Validator has to be attached to the parent form group containing both controls under investigation.
   * The 'dependentlyRequired' error is set for the first argument control name if it is empty but the related control has a value.
   *
   */
  static dependentlyRequired(requiredControlName: string, relatedControlName: string) {
    return (group: FormGroup): ValidationErrors => {
      const requiredControl = group.get(requiredControlName);
      const relatedControl = group.get(relatedControlName);
      const otherErrorKeys = Object.keys(requiredControl?.errors || {}).filter(x => x !== 'dependentlyRequired');

      if (requiredControl && !otherErrorKeys.length) {
        requiredControl.setErrors(
          !relatedControl?.value || requiredControl.value ? undefined : { dependentlyRequired: { valid: false } }
        );
      }
      return [];
    };
  }

  static moneyAmount(control: FormControl): { [error: string]: { valid: boolean } } {
    const moneyAmountPattern = /^$|^\d{1,9}(\.\d{1,2})?$/;
    if (!control.value) {
      return;
    }
    return moneyAmountPattern.test(control.value) ? undefined : { moneyAmount: { valid: false } };
  }
  static noSunday(control: FormControl): boolean {
    return SpecialValidators.noDay(control, 'sunday');
  }

  static noSaturday(control: FormControl): boolean {
    return SpecialValidators.noDay(control, 'saturday');
  }

  private static noDay(control: FormControl, day: 'saturday' | 'sunday'): boolean {
    const date = control.value as Date;

    return !(day === 'saturday' ? date?.getDay() === 6 : date?.getDay() === 0);
  }
}
