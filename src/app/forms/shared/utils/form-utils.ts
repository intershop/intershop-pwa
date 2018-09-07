import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

/**
 * Marks all fields in a form group as dirty recursively (i.e. for nested form groups also)
 * @param formGroup The form group
 */
export function markAsDirtyRecursive(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(key => {
    if (formGroup.controls[key] instanceof FormGroup) {
      markAsDirtyRecursive(formGroup.controls[key] as FormGroup);
    } else {
      formGroup.controls[key].markAsDirty();
      formGroup.controls[key].updateValueAndValidity();
    }
  });
}

/**
 * Updates validators for control
 * - enables required validator when there are elements in the array
 * - disables validator when no elements present
 * - resets control value to empty
 * @param control
 * @param array
 * @param validators
 * @param async
 */
export function updateValidatorsByDataLength(
  control: AbstractControl,
  // tslint:disable-next-line:no-any
  array: any[],
  validators: ValidatorFn | ValidatorFn[] = Validators.required,
  async = false
) {
  // asyncify this if async flag is set
  if (async) {
    return this.asyncify(() => this.updateValidatorsByDataLength(control, array, validators, false));
  }

  if (array && array.length) {
    control.setValidators(validators);
  } else {
    control.clearValidators();
  }
  control.setValue('');
  control.updateValueAndValidity();
}

/**
 * This method will mark all listed @param fields in the @param form as invalid.
 * These @param fields must be comma separated and
 * (if embedded in FormGroups other than the @param form) specified by their paths.
 * This means the email field in the credentials subform is qualified by 'credentials.email'.
 * @param form the root to start search with
 * @param fields comma separated, fully qualified paths to the field.
 */
export function markFormControlsAsInvalid(form: FormGroup, fields: string[]) {
  fields
    .map(attr => {
      let obj: AbstractControl | FormControl = form;
      attr.split('.').forEach(sub => {
        obj = obj.get(sub);
      });
      return obj as FormControl;
    })
    .filter(formControl => !!formControl)
    .forEach(formControl => {
      formControl.markAsDirty();
      formControl.setErrors({ incorrect: true });
    });
}

/**
 * Calls a function asynchronously
 * @param fn The function to be called asynchronously
 */
export function asyncify(fn: Function) {
  setTimeout(fn, 0);
  return;
}

export function arrayDiff<T>(a: T[], b: T[]): T[] {
  return a.filter(i => !b.includes(i));
}

export function arrayIntersect<T>(a: T[], b: T[]): T[] {
  return a.filter(i => b.includes(i));
}
