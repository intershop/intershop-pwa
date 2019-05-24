import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * an attribute directive that adds CSS classes to a dirty host element(s) related to the validity of a FormControl or a group of FormControls
 *
 * @example
 * <div class="form-group has-feedback" [formGroup]="form" [ishShowFormFeedback]="formControl">
 *               <input
 *                 [type]="type"
 *                 class="form-control"
 *                 [formControlName]="controlName">
 * </div>
 *
 * <div class="form-group has-feedback" [formGroup]="form" [ishShowFormFeedback]="[formControl, formControl2]">
 *               <input
 *                 [type]="type"
 *                 class="form-control"
 *                 [formControlName]="controlName">
 *
 *                <input
 *                 [type]="type"
 *                 class="form-control2"
 *                 [formControlName]="controlName2">
 * </div>
 */
@Directive({
  selector: '[ishShowFormFeedback]',
})
export class ShowFormFeedbackDirective {
  /**
   * FormControl which validation status is considered
   */
  // tslint:disable-next-line:no-input-rename
  @Input('ishShowFormFeedback') control: AbstractControl | AbstractControl[];

  /**
   *  If form control is invalid and dirty 'has-error' class is added
   */
  @HostBinding('class.has-error')
  get hasErrors() {
    return this.determineErrors();
  }

  /**
   *  If form control is valid and dirty 'has-success' class is added
   */
  @HostBinding('class.has-success')
  get hasSuccess() {
    if (this.control instanceof AbstractControl) {
      return this.control.validator && this.control.valid && this.control.dirty;
    } else if (Array.isArray(this.control)) {
      if (this.determineErrors()) {
        return false;
      }
      return this.control.every(control => control.validator && control.valid && control.dirty);
    }
  }

  private determineErrors(): boolean {
    if (this.control instanceof AbstractControl) {
      return this.control.validator && this.control.invalid && this.control.dirty;
    } else if (Array.isArray(this.control)) {
      return this.control.some(control => control.validator && control.invalid && control.dirty);
    }
  }
}
