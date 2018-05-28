import { Directive, HostBinding, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * an attribute directive that adds CSS classes to a dirty host element related to the validity of a FormControl
 *
 * @example
 * <div class="form-group has-feedback" [formGroup]="form" [ishShowFormFeedback]="formControl">
 *               <input
 *                 [type]="type"
 *                 class="form-control"
 *                 [formControlName]="controlName">
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
  @Input('ishShowFormFeedback') control: AbstractControl;

  /**
   *  If form control is invalid and dirty 'has-error' class is added
   */
  @HostBinding('class.has-error')
  get hasErrors() {
    return this.control.validator && this.control.invalid && this.control.dirty;
  }

  /**
   *  If form control is valid and dirty 'has-success' class is added
   */
  @HostBinding('class.has-success')
  get hasSuccess() {
    return this.control.validator && this.control.valid && this.control.dirty;
  }
}
